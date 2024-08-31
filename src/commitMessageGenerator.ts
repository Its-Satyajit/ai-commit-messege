import * as vscode from 'vscode';

import { sendCommitMessage } from './apiService';
import { loadConfig } from './config';
import { getGitChanges } from './gitOperations';

export async function generateCommitMessage(): Promise<string | null> {
    const config = loadConfig();
    const changes = await getGitChanges();

    if (changes) {
        const message = await sendCommitMessage(changes, config);
        return message;
    } else {
        vscode.window.showInformationMessage('No changes detected in the Git repository.');
        return null;
    }
}
