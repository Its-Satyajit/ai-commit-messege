import * as vscode from 'vscode';

export class StreamManager {
	private abortController = new AbortController();
	constructor(private outputChannel: vscode.OutputChannel) {}
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
			this.outputChannel.appendLine(`✅ Final message: ${fullMessage}`);
			return fullMessage;
		} catch (error) {
			this.outputChannel.appendLine(
				`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
			throw error;
		} finally {
			this.updateCommitInput(fullMessage);
		}
	}

	private updateCommitInput(content: string) {
		const cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/g, "");
		const finalMessage = cleanedContent.replace(/```.*/g, "").trim();

		const isValid = this.validateCommit(finalMessage);
		if (!isValid) {
			this.outputChannel.appendLine("⚠️ Generated message needs manual review");
		}
		const repo = vscode.extensions
			.getExtension("vscode.git")
			?.exports?.getAPI(1)?.repositories[0];

		if (repo?.inputBox) {
			repo.inputBox.value = finalMessage;
		}
	}

	abort() {
		this.abortController.abort();
		this.abortController = new AbortController();
	}
	private validateCommit(message: string): boolean {
		return /^(feat|fix|chore|docs|style|refactor|perf|test)(\(\w+\))?: [a-z][a-z0-9 ]{1,72}$/m.test(
			message,
		);
	}
}
