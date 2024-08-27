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
    const config = vscode.workspace.getConfiguration('commitMessageGenerator');
    return {
        apiUrl: config.get('apiUrl', ''),
        model: config.get('model', ''),
        temperature: config.get('temperature', 0.7),
        maxTokens: config.get('maxTokens', 5000),
        stream: false,
        apiKey: config.get('apiKey', ''),
        types: config.get('types', []),
        scopes: config.get('scopes', []),
    };
}

function getGitChanges(): string | null {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspaceFolder) {
            console.error('No workspace folder found. Make sure you have an active workspace.');
            return null;
        }

        const options: ExecSyncOptionsWithStringEncoding = {
            encoding: 'utf8',
            cwd: workspaceFolder,
        };

        const stagedChanges = execSync('git diff --cached', options).trim();
        const unstagedChanges = execSync('git diff', options).trim();

        if (stagedChanges || unstagedChanges) {
            return stagedChanges || unstagedChanges;
        }

        return null;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching git changes: ${error.message}`);
            vscode.window.showErrorMessage(`Failed to fetch Git changes: ${error.message}`);
        } else {
            console.error('Error fetching git changes: An unknown error occurred.');
            vscode.window.showErrorMessage('Failed to fetch Git changes: An unknown error occurred.');
        }
        return null;
    }
}

function detectBreakingChanges(changes: string): boolean {
    const breakingChangePatterns = [
        /BREAKING CHANGE/i,
        /major/i,
        /removes? (.*) (features|functions|endpoints|methods|APIs)/i,
        /incompatible/i,
        /deprecated/i,
        /changes? (.*) that (break|remove)/i,
    ];

    return breakingChangePatterns.some((pattern) => pattern.test(changes));
}

function estimateTokens(text: string): number {
    // A rough estimate assuming each word is about 1.3 tokens on average.
    return Math.ceil(text.split(/\s+/).length * 1.3);
}

async function sendCommitMessage(changes: string, config: Config): Promise<string | null> {
    if (!config.apiKey) {
        console.error('API key is missing. Cannot send commit message.');
        vscode.window.showErrorMessage('API key is missing in the extension settings.');
        return null;
    }

    const promptBase = `\n\nCommit Types: ${config.types.join(', ')}\nCommit Scopes: ${config.scopes.join(
        ', '
    )}\n\nPlease provide only the commit message without any additional text.`;

    // Estimate tokens for the fixed parts
    const staticTokenUsage =
        estimateTokens(
            `Given the following git changes and commit options, determine the appropriate commit type and scope, then generate a commit message in the Conventional Commits format:\n\nChanges:\n`
        ) + estimateTokens(promptBase);

    // Reserve tokens for the model's response
    const responseTokenBuffer = 200; // Adjust this number as needed based on typical response length
    const maxPromptLength = config.maxTokens - staticTokenUsage - responseTokenBuffer;

    let trimmedChanges = changes;
    if (estimateTokens(changes) > maxPromptLength) {
        trimmedChanges =
            changes.slice(0, Math.floor((changes.length * maxPromptLength) / estimateTokens(changes))) +
            '\n\n... (truncated due to length)';
        vscode.window.showWarningMessage(
            'The diff is too large and has been truncated to fit the maximum token length for this message.'
        );
    }

    const prompt = `Given the following git changes and commit options, determine the appropriate commit type and scope, then generate a commit message in the Conventional Commits format:\n\nChanges:\n${trimmedChanges}${promptBase}`;

    const payload = {
        model: config.model,
        messages: [{ role: 'system', content: prompt }],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        stream: config.stream,
    };

    try {
        const response = await axios.post(config.apiUrl, payload, {
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (Array.isArray(response.data.choices) && response.data.choices.length > 0) {
            const message = response.data.choices[0]?.message?.content?.trim();
            if (message) {
                return message;
            } else {
                console.error('Invalid message structure in API response.');
                vscode.window.showErrorMessage(
                    'Failed to generate commit message: Invalid message structure in API response.'
                );
            }
        } else {
            console.error('No choices found in API response.');
            vscode.window.showErrorMessage('Failed to generate commit message: No choices found in API response.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error sending commit message: ${error.message}`);
            vscode.window.showErrorMessage(`Failed to generate commit message: ${error.message}`);
        } else {
            console.error('Error sending commit message: An unknown error occurred.');
            vscode.window.showErrorMessage('Failed to generate commit message: An unknown error occurred.');
        }
    }
    return null;
}

export async function main(): Promise<string | null> {
    const config = loadConfig();
    const changes = getGitChanges();

    if (changes) {
        const message = await sendCommitMessage(changes, config);
        return message;
    } else {
        vscode.window.showInformationMessage('No changes detected in the Git repository.');
        return null;
    }
}
