export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string> = {},
  ) {}

  async *streamingPost<T>(endpoint: string, body: object): AsyncGenerator<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Empty response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value as Uint8Array, { stream: true });
        const chunks = buffer.split("\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const trimmed = chunk.trim();
          if (!trimmed) {
            continue;
          }

          try {
            yield JSON.parse(trimmed);
          } catch (error) {
            console.error("Failed to parse chunk:", error);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
