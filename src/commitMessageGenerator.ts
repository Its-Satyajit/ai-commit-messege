import axios from 'axios';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import * as vscode from 'vscode';

interface Config {
    apiUrl: string;
    model: string;
    temperature: number;
    maxTokens: number;
    stream: boolean;
    apiKey: string;
    types: string[];
    scopes: string[];
}
function loadConfig(): Config {
    const config: Config = {
        apiUrl: vscode.workspace.getConfiguration('commitMessageGenerator').get('apiUrl', ''),
        model: vscode.workspace.getConfiguration('commitMessageGenerator').get('model', ''),
        temperature: vscode.workspace.getConfiguration('commitMessageGenerator').get('temperature', 0.7),
        maxTokens: vscode.workspace.getConfiguration('commitMessageGenerator').get('maxTokens', 5000),
        stream: vscode.workspace.getConfiguration('commitMessageGenerator').get('stream', false),
        apiKey: vscode.workspace.getConfiguration('commitMessageGenerator').get('apiKey', ''),
        types: vscode.workspace.getConfiguration('commitMessageGenerator').get('types', []),
        scopes: vscode.workspace.getConfiguration('commitMessageGenerator').get('scopes', []),
    };
    return config;
}
function getGitChanges(): string | null {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspaceFolder) {
            console.error('No workspace folder found.');
            return null;
        }
        const options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf8', cwd: workspaceFolder };
        const stagedChanges = execSync('git diff --cached', options).trim();
        const unstagedChanges = execSync('git diff', options).trim();
        if (stagedChanges) {
            return stagedChanges;
        } else if (unstagedChanges) {
            return unstagedChanges;
        }
        return null;
    } catch (error) {
        const err = error as Error;
        console.error(`Error fetching git changes: ${err.message}`);
        return null;
    }
}
function generateCommitMessage(changes: string, config: Config): string {
    const description = changes.slice(0, 2000).replace(/\s+/g, ' ').trim();
    let commitType = 'chore';
    let commitScope = 'general';
    for (const type of config.types) {
        if (description.match(new RegExp(type, 'i'))) {
            commitType = type;
            break;
        }
    }
    for (const scope of config.scopes) {
        if (description.match(new RegExp(scope, 'i'))) {
            commitScope = scope;
            break;
        }
    }
    return `${commitType}(${commitScope}): ${description}`;
}
async function sendCommitMessage(commitMessage: string, config: Config): Promise<string | null> {
    if (!config.apiKey) {
        console.error('API key is missing. Cannot send commit message.');
        return null;
    }
    const prompt = `Generate a commit message in the Conventional Commits format based on the following changes:\n\n${commitMessage}\n\nPlease provide only the commit message without any additional text.`;
    const payload = {
        model: config.model,
        messages: [{ role: 'system', content: prompt }],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        stream: config.stream,
    };
    try {
        const response = await axios.post(config.apiUrl, payload, {
            headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
        });
        const message = response.data.choices[0].message.content.trim();
        return message;
    } catch (error) {
        const err = error as Error;
        console.error(`Error sending commit message: ${err.message}`);
        return null;
    }
}
export async function main(): Promise<string | null> {
    const config = loadConfig();
    const changes = getGitChanges();
    if (changes) {
        const commitMessage = generateCommitMessage(changes, config);
        const message = await sendCommitMessage(commitMessage, config);
        return message;
    } else {
        console.log('No changes found.');
        return null;
    }
}
