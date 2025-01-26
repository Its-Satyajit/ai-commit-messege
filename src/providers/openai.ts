import { HttpClient } from '../core/httpClient';
import type { OpenAIChunk } from '../types';
import type {
  AIProvider,
  ProviderConfig,
} from './aiProvider';

export class OpenAIProvider implements AIProvider {
  constructor(private client: HttpClient) {}

  async *createStream(
    diff: string,
    systemPrompt: string,
    config: ProviderConfig,
  ): AsyncIterable<string> {
    const stream = this.client.streamingPost<OpenAIChunk>("/chat/completions", {
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: diff },
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
