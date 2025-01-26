import { HttpClient } from '../core/httpClient';
import type {
  AIProvider,
  ProviderConfig,
} from './aiProvider';

interface OllamaResponse {
  response?: string; 
}

export class OllamaProvider implements AIProvider {
  constructor(private client: HttpClient) {}

  async *createStream(
    diff: string,
    systemPrompt: string,
    config: ProviderConfig
  ): AsyncIterable<string> {
    const fullPrompt = `${systemPrompt}\n\nDiff:\n${diff}`;
    
    const stream = this.client.streamingPost<OllamaResponse>('/api/generate', {
      model: config.model,
      prompt: fullPrompt,
      options: {
        temperature: config.temperature,
        num_predict: config.maxTokens
      },
      stream: true
    });

    for await (const chunk of stream) {
      yield chunk.response || '';
    }
  }
}