import axios from 'axios';
import * as vscode from 'vscode';

import { Config } from './config.js';

function estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
}

function replaceMultipleSpacesWithTab(input: string): string {
    return input.replace(/ {4}/g, '\t');
}

export async function sendCommitMessage(changes: string, config: Config): Promise<string | null> {
    if (!config.apiKey) {
        console.error('API key is missing. Cannot send commit message.');
        vscode.window.showErrorMessage('API key is missing in the extension settings.');
        return null;
    }

    const promptBase = `Based on the provided diffs, generate a Conventional Commit message that strictly follows the Conventional Commits specification. The commit message must include:

-   A **type** that indicates the type of change. Choose from ${config.types.join(', ')}.
-   An optional **scope** that indicates the part of the codebase affected. Choose from ${config.scopes.join(', ')}.
-   A concise **description** of the change.

Optionally, include:

-   A optional **body** for more detailed information, especially for breaking changes, starting with \`BREAKING CHANGE:\`.
-   A optional **footer** for metadata such as issue numbers, links, or additional notes.

**Important:** Only return the commit message, formatted as specified, without any additional text or explanation.

**Changes**

${changes}`;

    const staticTokenUsage = estimateTokens(promptBase);
    const responseTokenBuffer = 200;
    const maxPromptLength = config.maxTokens - staticTokenUsage - responseTokenBuffer;

    let trimmedChanges = changes;
    if (estimateTokens(changes) > maxPromptLength) {
        trimmedChanges =
            changes.slice(0, Math.floor((changes.length * maxPromptLength) / estimateTokens(changes))) +
            '\n\n... (truncated due to length)';
        vscode.window.showWarningMessage(
            'The diff is too large. Try Staged Changes instead for Specific Commit Message'
        );
    }

    const prompt = `${replaceMultipleSpacesWithTab(promptBase)}`;

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
