import Anthropic from "@anthropic-ai/sdk";
import { WorkflowProject, AgentResult } from "../types";

export abstract class BaseAgent {
  protected client: Anthropic;

  constructor(client: Anthropic) {
    this.client = client;
  }

  abstract process(project: WorkflowProject): Promise<AgentResult>;

  protected async callClaude(
    systemPrompt: string,
    userMessage: string,
    maxTokens: number = 3000
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");
    return content.text;
  }

  protected parseJSON<T>(text: string, fallback: T): T {
    try {
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  }

  protected getTokenMetadata(response: {
    usage: { input_tokens: number; output_tokens: number };
  }) {
    return {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: "claude-opus-4-7",
    };
  }
}
