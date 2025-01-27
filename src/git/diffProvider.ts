import * as vscode from 'vscode';

export class GitDiffProvider {
	constructor(private outputChannel: vscode.OutputChannel) {}
	async getStagedDiff(): Promise<string> {
		this.outputChannel.appendLine("🔍 Checking for staged changes...");
		const gitExtension = vscode.extensions.getExtension("vscode.git");
		if (!gitExtension?.isActive) {
			throw new Error("Git extension not available");
		}

		const api = gitExtension.exports.getAPI(1);
		const repo = api.repositories[0];

		if (!repo) {
			throw new Error("No Git repository found");
		}

		const stagedChanges = await repo.state.indexChanges;
		if (stagedChanges.length === 0) {
			throw new Error("No staged changes to commit");
		}

		const diff = await repo.diff(true);
		this.outputChannel.appendLine(
			`📋 Found diff (${diff.length} characters):\n${diff.slice(0, 500)}...`,
		);

		return diff;
	}
}
