export interface AIProvider {
  createStream(
    diff: string,
    systemPrompt: string,
    config: ProviderConfig,
  ): AsyncIterable<string>;
}

export interface ProviderConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}
