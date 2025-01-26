// Replace namespaces with interfaces
export interface OpenAIChunk {
  choices: {
    delta: { content?: string };
  }[];
}

export interface OllamaChunk {
  message?: { content?: string };
}

export type ProviderResponse = OpenAIChunk | OllamaChunk;
