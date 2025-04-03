import * as vscode from "vscode";

export class StreamManager {
  private abortController = new AbortController();
  constructor(private outputChannel: vscode.OutputChannel) {}

  private validateCommit(message: string): boolean {
    return /^(feat|fix|chore|docs|style|refactor|perf|test)(\(\w+\))?: [a-z][a-z0-9 ]{1,72}$/m.test(
      message,
    );
  }

  async handleStream(
    stream: AsyncIterable<string>,
    onUpdate: (content: string) => void,
  ): Promise<string> {
    let fullMessage = "";
    this.outputChannel.appendLine("🚀 Starting commit message generation...");

    try {
      for await (const chunk of stream) {
        if (this.abortController.signal.aborted) {
          throw new Error("Generation aborted");
        }

        fullMessage += chunk;
        onUpdate(fullMessage);
      }
      const filteredMessage = fullMessage
        .replace(/<think>.*?<\/think>/gs, "")
        .replace(/```/gs, "")
        .trim();

      const isValid = this.validateCommit(filteredMessage);
      if (!isValid) {
        this.outputChannel.appendLine(
          "⚠️ Generated message needs manual review",
        );
      }
      this.outputChannel.appendLine(`✅ Final message: ${filteredMessage}`);
      return filteredMessage;
    } catch (error) {
      this.outputChannel.appendLine(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  abort() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }
}
