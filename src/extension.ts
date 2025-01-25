import * as vscode from "vscode";

import { generateCommitMessage } from "./commitMessageGenerator";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"extension.generateCommitMessage",
		async () => {
			const gitExtension =
				vscode.extensions.getExtension("vscode.git")?.exports;
			const api = gitExtension?.getAPI(1);
			const repository = api?.repositories[0];
			if (!repository) {
				vscode.window.showErrorMessage("No active Git repository found.");
				return;
			}
			const progressOptions: vscode.ProgressOptions = {
				location: vscode.ProgressLocation.Notification,
				title: "Generating commit message...",
				cancellable: false,
			};
			await vscode.window.withProgress(progressOptions, async (progress) => {
				try {
					const commitMessage = await generateCommitMessage();
					if (commitMessage) {
						repository.inputBox.value = commitMessage;
					} else {
						vscode.window.showInformationMessage(
							"No changes detected or message generation failed.",
						);
					}
				} catch (error) {
					vscode.window.showErrorMessage(
						`An unexpected error occurred: ${(error as Error).message}`,
					);
				}
			});
		},
	);
	context.subscriptions.push(disposable);
}
export function deactivate() {}