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
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let position;

        while ((position = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, position).trim();
          buffer = buffer.slice(position + 1);

          if (!line) continue; 

          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              yield JSON.parse(data);
            } catch (error) {
              console.error("Failed to parse SSE chunk:", error, "Data:", data);
            }
          } else {
            try {
              yield JSON.parse(line);
            } catch (error) {
              console.error(
                "Failed to parse JSON chunk:",
                error,
                "Line:",
                line,
              );
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
