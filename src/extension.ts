import * as vscode from 'vscode';

import { main } from './commitMessageGenerator';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateCommitMessage', async () => {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        const api = gitExtension?.getAPI(1);
        const repository = api?.repositories[0];
        if (!repository) {
            vscode.window.showErrorMessage('No active Git repository found.');
            return;
        }
        const commitMessage = await main();
        if (commitMessage) {
            repository.inputBox.value = commitMessage;
        } else {
            vscode.window.showInformationMessage('No changes detected or message generation failed.');
        }
    });
    context.subscriptions.push(disposable);
}
export function deactivate() {}
