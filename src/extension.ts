import * as vscode from 'vscode';
import {
  getSystemPrompt,
  loadConfig,
} from './config';
import { HttpClient } from './core/httpClient';
import { GitDiffProvider } from './git/diffProvider';
import { OllamaProvider } from './providers/ollama';
import { OpenAIProvider } from './providers/openai';
import { StreamManager } from './stream/manager';

// Define the Git extension types
interface GitAPI {
    repositories: any[];
    getRepository(uri: vscode.Uri): any;
}

interface GitExtension {
    readonly enabled: boolean;
    getAPI(version: 1): GitAPI;
}

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel(
        "AI Commit Message Generator",
    );
    context.subscriptions.push(outputChannel);

    const streamManager = new StreamManager(outputChannel);
    const diffProvider = new GitDiffProvider(outputChannel);

    const generateCommitMessage = async (scm?: any) => {
        try {
            outputChannel.appendLine('🚀 Starting commit message generation');

            // Get the Git extension with proper typing
            const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
            if (!gitExtension) {
                throw new Error("Git extension not available");
            }

            if (!gitExtension.isActive) {
                await gitExtension.activate();
            }

            const gitApi = gitExtension.exports.getAPI(1);

            // Get repository from SCM provider if available
            let repo = scm?.rootUri ? gitApi.getRepository(scm.rootUri) : undefined;

            // Fallback to first repo if no SCM context
            if (!repo) {
                if (gitApi.repositories.length > 0) {
                    repo = gitApi.repositories[0];
                    outputChannel.appendLine('ℹ️ Using first available repository');
                } else {
                    throw new Error("No Git repositories found");
                }
            }

            outputChannel.appendLine(`🏷️ Using repository: ${repo.rootUri.fsPath}`);
            outputChannel.appendLine(`🌿 Branch: ${repo.state.HEAD?.name || 'unknown'}`);

            const config = loadConfig();
            const diff = await diffProvider.getStagedDiff(repo);

            const client = config.provider === "openai"
                ? new OpenAIProvider(
                    new HttpClient(
                        config.baseUrl || "https://api.openai.com/v1",
                        { Authorization: `Bearer ${config.apiKey}` },
                    ),
                    outputChannel,
                )
                : new OllamaProvider(
                    new HttpClient(config.baseUrl || "http://localhost:11434"),
                    outputChannel,
                );

            // Generate and stream the commit message
            const commitMessage = await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Generating commit message...",
                    cancellable: true,
                },
                async (progress, token) => {
                    token.onCancellationRequested(() => {
                        streamManager.abort();
                    });

                    return streamManager.handleStream(
                        client.createStream(
                            diff,
                            getSystemPrompt(config.types, config.scopes),
                            {
                                model: config.model,
                                temperature: config.temperature,
                                maxTokens: config.maxTokens,
                            },
                        ),
                        (content) => progress.report({ message: content }),
                    );
                },
            );

            // Insert message into SCM input box
            if (scm?.inputBox) {
                scm.inputBox.value = commitMessage;
            } else if (repo.inputBox) {
                repo.inputBox.value = commitMessage;
            }

            outputChannel.appendLine('✅ Commit message generated successfully');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            outputChannel.appendLine(`🔥 Error: ${errorMessage}`);

            vscode.window.showErrorMessage(
                `Commit generation failed: ${errorMessage}`,
                "Show Logs"
            ).then(selection => {
                if (selection === "Show Logs") {
                    outputChannel.show();
                }
            });
        }
    };

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "extension.generateCommitMessageFromSCM",
            (scm) => generateCommitMessage(scm)
        ),
        vscode.commands.registerCommand(
            "extension.generateCommitMessage",
            () => generateCommitMessage()
        ),
        vscode.commands.registerCommand(
            "extension.showCommitLogs",
            () => outputChannel.show()
        )
    );
}