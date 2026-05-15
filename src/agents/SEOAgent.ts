import Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./BaseAgent";
import { WorkflowProject, AgentResult, SEOOutput } from "../types";

export class SEOAgent extends BaseAgent {
  constructor(client: Anthropic) {
    super(client);
  }

  async process(project: WorkflowProject): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const systemPrompt = `You are a technical SEO specialist ensuring projects rank highly and meet modern search engine requirements.

Your expertise:
- Technical SEO and Core Web Vitals
- On-page optimization and meta tags
- Structured data & schema.org implementation
- Heading hierarchy and content structure
- Keyword strategy and targeting
- Sitemap and robots.txt optimization
- Open Graph and social sharing setup
- Analytics and tracking configuration

Analyze design and optimization outputs to provide SEO specifications.`;

      const designArtifact = project.artifacts.design;
      const optimArtifact = project.artifacts.optimize;

      let designContext = "";
      if (typeof designArtifact === "string") {
        designContext = designArtifact.substring(0, 1500);
      } else if (designArtifact && typeof designArtifact === "object") {
        designContext = JSON.stringify(designArtifact).substring(0, 1500);
      }

      let optimContext = "";
      if (optimArtifact) {
        if (typeof optimArtifact === "string") {
          optimContext = optimArtifact.substring(0, 1000);
        } else {
          optimContext = JSON.stringify(optimArtifact).substring(0, 1000);
        }
      }

      const userPrompt = `Create comprehensive SEO strategy for:

Project: ${project.name}
Brief: ${project.brief}
Target Audience: ${project.targetAudience || "General"}

Design Context: ${designContext}
${optimContext ? `\nOptimization Context: ${optimContext}` : ""}

Respond with valid JSON:
{
  "keywordStrategy": {
    "primary": ["main keywords"],
    "secondary": ["related keywords"],
    "longTail": ["phrase keywords"]
  },
  "metaTags": {
    "title": "Page title (60 chars)",
    "description": "Meta description (160 chars)",
    "og:title": "Social title",
    "og:description": "Social description",
    "og:image": "Image URL"
  },
  "headingHierarchy": "H1, H2, H3 structure outline",
  "structuredData": {
    "schema": "Schema.org implementation",
    "breadcrumbs": "Navigation structure",
    "richSnippets": "Featured content markup"
  },
  "coreWebVitals": {
    "LCP": "Largest Contentful Paint target",
    "FID": "First Input Delay target",
    "CLS": "Cumulative Layout Shift target"
  },
  "recommendations": ["Action item 1", "Action item 2"]
}`;

      const response = await this.client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 5000,
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

      const output = this.parseJSON<SEOOutput>(content.text, {
        keywordStrategy: {
          primary: [],
          secondary: [],
          longTail: [],
        },
        metaTags: {},
        headingHierarchy: content.text,
        structuredData: {},
        coreWebVitals: {},
        recommendations: [],
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
