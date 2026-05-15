import Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./BaseAgent";
import { WorkflowProject, AgentResult, DesignOutput } from "../types";

export class DesignAgent extends BaseAgent {
  constructor(client: Anthropic) {
    super(client);
  }

  async process(project: WorkflowProject): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const systemPrompt = `You are an expert ultra-modern web design agent specializing in Awwwards 2026 standards.

Your responsibilities:
1. Create responsive, mobile-first component designs
2. Implement modern animations with framer-motion syntax
3. Generate Tailwind CSS configurations with custom design tokens
4. Ensure WCAG AA accessibility compliance
5. Design dark mode support using CSS variables
6. Create micro-interactions and gesture-based UI elements
7. Output production-ready React/Vue component JSX

Always output structured JSON with:
- componentLibrary: Full component code (React/Vue JSX)
- tailwindConfig: Extended Tailwind configuration with custom theme
- figmaTokens: Design tokens exportable to Figma
- designSystem: Color, typography, spacing tokens
- animations: Framer-motion keyframes and transition definitions
- accessibilityReport: WCAG AA compliance checklist with implementations`;

      const userPrompt = `Design a modern, award-winning website based on this brief:

Project Name: ${project.name}
Brief: ${project.brief}
Target Audience: ${project.targetAudience || "General"}
Source URL: ${project.sourceUrl || "N/A"}

Respond with VALID JSON containing:
{
  "componentLibrary": "React components with Tailwind classes",
  "tailwindConfig": "tailwind.config.js content",
  "figmaTokens": { design token mappings },
  "animations": "Framer-motion animation definitions",
  "accessibilityReport": "WCAG AA compliance details"
}

Ensure all code is production-ready and follows modern best practices.`;

      const response = await this.client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 8000,
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
        throw new Error("Unexpected response type from Claude");
      }

      const output = this.parseJSON<DesignOutput>(content.text, {
        componentLibrary: content.text,
        tailwindConfig: "",
        figmaTokens: {},
        animations: "",
        accessibilityReport: "See componentLibrary for accessibility details",
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        success: false,
        output: "",
        duration,
        error: errorMessage,
      };
    }
  }
}
