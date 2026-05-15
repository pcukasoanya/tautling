import Anthropic from "@anthropic-ai/sdk";
import { DesignAgent } from "./agents/DesignAgent";
import { OptimizationAgent } from "./agents/OptimizationAgent";
import { SEOAgent } from "./agents/SEOAgent";
import { DeploymentAgent } from "./agents/DeploymentAgent";
import { WorkflowProject } from "./types";

export class WorkflowOrchestrator {
  private client: Anthropic;
  private agents: Map<string, DesignAgent | OptimizationAgent | SEOAgent | DeploymentAgent>;

  constructor() {
    this.client = new Anthropic();
    this.agents = new Map([
      ["design", new DesignAgent(this.client)],
      ["optimize", new OptimizationAgent(this.client)],
      ["seo", new SEOAgent(this.client)],
      ["deploy", new DeploymentAgent(this.client)],
    ]);
  }

  async executeWorkflow(project: WorkflowProject): Promise<WorkflowProject> {
    const stages: Array<"design" | "optimize" | "seo" | "deploy"> = [
      "design",
      "optimize",
      "seo",
      "deploy",
    ];

    console.log(`\n🚀 Starting workflow for: ${project.name}`);
    console.log(`📋 Brief: ${project.brief}\n`);

    for (const stage of stages) {
      console.log(
        `[${project.name}] 🔄 ${stage.toUpperCase()} stage (${Math.round(Date.now() / 1000)}s)...`
      );

      const agent = this.agents.get(stage);
      if (!agent) throw new Error(`Agent not found for stage: ${stage}`);

      const result = await agent.process(project);

      project.artifacts[stage] = result.output;
      project.metadata[stage] = {
        completedAt: new Date().toISOString(),
        duration: result.duration,
        status: result.success ? "completed" : "failed",
        ...(result.metadata || {}),
      };

      if (!result.success) {
        console.error(`❌ ${stage} agent failed: ${result.error}`);
        throw new Error(`${stage} agent failed: ${result.error || "Unknown error"}`);
      }

      console.log(
        `✅ ${stage} completed in ${result.duration}ms | Tokens: ${result.metadata?.outputTokens || 0}`
      );
    }

    console.log(`\n🎉 Workflow completed for: ${project.name}`);
    return project;
  }

  async executeWorkflows(
    projects: WorkflowProject[]
  ): Promise<WorkflowProject[]> {
    const results: WorkflowProject[] = [];

    for (const project of projects) {
      try {
        const result = await this.executeWorkflow(project);
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to execute workflow for ${project.name}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    return results;
  }
}
