export interface HttpClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export type StreamHandler<T> = (chunk: T) => void;
