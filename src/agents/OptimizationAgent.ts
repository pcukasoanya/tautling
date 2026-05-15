import Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./BaseAgent";
import { WorkflowProject, AgentResult, OptimizationOutput } from "../types";

export class OptimizationAgent extends BaseAgent {
  constructor(client: Anthropic) {
    super(client);
  }

  async process(project: WorkflowProject): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const designArtifact = project.artifacts.design;
      let componentCode = "";

      if (typeof designArtifact === "string") {
        try {
          const parsed = JSON.parse(designArtifact);
          componentCode = parsed.componentLibrary || designArtifact;
        } catch {
          componentCode = designArtifact;
        }
      } else if (designArtifact && typeof designArtifact === "object") {
        componentCode = (designArtifact as any).componentLibrary || JSON.stringify(designArtifact);
      }

      const systemPrompt = `You are a code optimization expert specializing in React/Vue performance.

Your responsibilities:
1. Analyze React/Vue component code for performance issues
2. Identify bundle size optimization opportunities
3. Implement code-splitting strategies
4. Optimize images and asset loading
5. Refactor for maintainability and DRY principles
6. Conduct security vulnerability scanning
7. Generate optimization recommendations with estimated improvements

Output structured JSON with:
- optimizedCode: Refactored component code with improvements
- bundleAnalysis: Size metrics before/after with savings
- recommendations: Prioritized optimization list (critical → low)
- securityIssues: Identified vulnerabilities and fixes
- estimatedImprovement: Performance and bundle gains`;

      const userPrompt = `Optimize this component code:

Project: ${project.name}
Component Code:
\`\`\`
${componentCode.substring(0, 2000)}
\`\`\`

Provide optimizations as valid JSON with:
{
  "optimizedCode": "Refactored code",
  "bundleAnalysis": {
    "before": { "main": 150, "vendor": 200 },
    "after": { "main": 120, "vendor": 150 },
    "savings": { "main": "-20%", "vendor": "-25%" }
  },
  "recommendations": [
    {
      "priority": "critical",
      "issue": "Issue description",
      "solution": "How to fix",
      "estimatedGain": "Performance impact"
    }
  ],
  "securityIssues": [
    {
      "severity": "high",
      "vulnerability": "Description",
      "fix": "How to patch"
    }
  ],
  "estimatedImprovement": {
    "bundleSizeReduction": "30%",
    "performanceGain": "40% faster",
    "loadTimeImprovement": "2.5s → 1.5s"
  }
}`;

      const response = await this.client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 6000,
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

      const output = this.parseJSON<OptimizationOutput>(content.text, {
        optimizedCode: content.text,
        bundleAnalysis: {
          before: {},
          after: {},
          savings: {},
        },
        recommendations: [],
        securityIssues: [],
        estimatedImprovement: {
          bundleSizeReduction: "TBD",
          performanceGain: "TBD",
          loadTimeImprovement: "TBD",
        },
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
