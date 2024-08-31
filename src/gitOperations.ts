import {
  exec,
  execSync,
  ExecSyncOptionsWithStringEncoding,
} from 'child_process';
import * as Diff from 'diff';
import { promisify } from 'util';
import * as vscode from 'vscode';

// Promisify exec to use async/await
const execPromise = promisify(exec);

export async function getGitChanges(): Promise<string | null> {
    try {
        const repoPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!repoPath) {
            vscode.window.showErrorMessage('No workspace folder found. Make sure you have an active workspace.');
            return null;
        }

        const options: ExecSyncOptionsWithStringEncoding = {
            encoding: 'utf8',
            cwd: repoPath,
        };

        const stagedChanges = execSync('git diff --cached', options).trim();
        const unstagedChanges = execSync('git diff', options).trim();

        // Set `changes` to `stagedChanges` if `unstagedChanges` does not exist
        const changes = stagedChanges || unstagedChanges;
        const diffBlocks = changes.split('diff --git').slice(1);
        const formattedChanges = diffBlocks
            .map((block) => {
                const lines = block.trim().split('\n');
                const filenameLine = lines.find((line) => line.startsWith('---') || line.startsWith('+++'));
                const filename = filenameLine
                    ? filenameLine
                          .replace(/^[-+]{3} /, '')
                          .replace(/^a\//, '')
                          .replace(/^b\//, '')
                    : 'unknown';
                const diffContent = lines.slice(1).join('\n');
                const diffString = Diff.createPatch(filename, '', diffContent, '', '');
                return `**${filename}**\n\n\`\`\`diff\n${diffString}\n\`\`\``;
            })
            .join('\n\n');

        return formattedChanges;
    } catch (err) {
        const error = err as Error;
        console.error(`Error fetching git changes: ${error.message}`);
        vscode.window.showErrorMessage(`Failed to fetch Git changes: ${error.message}`);
        return null;
    }
}
