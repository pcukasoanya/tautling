import Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./BaseAgent";
import { WorkflowProject, AgentResult, DeploymentOutput } from "../types";

export class DeploymentAgent extends BaseAgent {
  constructor(client: Anthropic) {
    super(client);
  }

  async process(project: WorkflowProject): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const optimizedCode = project.artifacts.optimize;
      const seoConfig = project.artifacts.seo;

      const systemPrompt = `You are a deployment automation expert. Your role:

1. Generate comprehensive test suites (Jest/Vitest)
2. Create E2E tests (Playwright/Cypress syntax)
3. Design CI/CD pipeline (GitHub Actions/GitLab CI)
4. Write deployment automation scripts
5. Implement health checks and monitoring
6. Create rollback procedures
7. Setup environment configurations

Output structured JSON with:
- testSuite: Unit and integration tests (Jest/Vitest format)
- e2eTests: End-to-end test scenarios (Playwright/Cypress)
- cicdPipeline: GitHub Actions workflow YAML
- deploymentScript: Bash/Node deployment automation
- healthChecks: Monitoring and alerting setup
- rollbackProcedure: Safe rollback documentation`;

      let optimContext = "";
      if (optimizedCode) {
        if (typeof optimizedCode === "string") {
          optimContext = optimizedCode.substring(0, 1200);
        } else {
          optimContext = JSON.stringify(optimizedCode).substring(0, 1200);
        }
      }

      let seoContext = "";
      if (seoConfig) {
        if (typeof seoConfig === "string") {
          seoContext = seoConfig.substring(0, 800);
        } else {
          seoContext = JSON.stringify(seoConfig).substring(0, 800);
        }
      }

      const userPrompt = `Create deployment automation for:

Project: ${project.name}
Brief: ${project.brief}

Optimized Code:
${optimContext}

SEO Config:
${seoContext}

Respond with comprehensive deployment JSON:
{
  "testSuite": "Jest/Vitest configuration and test examples",
  "e2eTests": "Playwright/Cypress test scenarios",
  "cicdPipeline": "GitHub Actions workflow YAML",
  "deploymentScript": "Deployment bash/Node.js script",
  "healthChecks": "Health check implementation and monitoring",
  "rollbackProcedure": "Step-by-step rollback documentation"
}`;

      const response = await this.client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 7000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      const output = this.parseJSON<DeploymentOutput>(content.text, {
        testSuite: "",
        e2eTests: "",
        cicdPipeline: content.text,
        deploymentScript: "",
        healthChecks: "",
        rollbackProcedure: "",
      });

      const duration = Date.now() - startTime;

      return {
        success: true,
        output,
        duration,
        metadata: this.getTokenMetadata(response),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        output: "",
        duration,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
