import * as vscode from 'vscode';

export interface Config {
    apiUrl: string;
    model: string;
    temperature: number;
    maxTokens: number;
    stream: boolean;
    apiKey: string;
    types: string[];
    scopes: string[];
}

export function loadConfig(): Config {
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
