import * as vscode from 'vscode';

import { main } from './commitMessageGenerator';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateCommitMessage', async () => {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        const api = gitExtension?.getAPI(1);
        const repository = api?.repositories[0];

        if (!repository) {
            vscode.window.showErrorMessage(
                'No active Git repository found. Please open a repository to generate a commit message.'
            );
            return;
        }

        try {
            const commitMessage = await main();
            if (commitMessage) {
                repository.inputBox.value = commitMessage;
                vscode.window.showInformationMessage('Commit message generated and inserted.');
            } else {
                vscode.window.showInformationMessage('No changes detected or commit message generation failed.');
            }
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`An unexpected error occurred: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unexpected error occurred.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
