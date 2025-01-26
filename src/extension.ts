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

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel(
    "AI Commit Message Generator",
  );
  context.subscriptions.push(outputChannel);

  const streamManager = new StreamManager(outputChannel);
  const diffProvider = new GitDiffProvider(outputChannel);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.generateCommitMessage",
      async () => {
        try {
          const config = loadConfig();
          const diff = await diffProvider.getStagedDiff();

          const client = config.provider === "openai"
            ? new OpenAIProvider(
              new HttpClient(
                config.baseUrl || "http://localhost:1234/v1",
                { "Authorization": `Bearer ${config.apiKey}` },
              ),
              outputChannel,
            )
            : new OllamaProvider(
              new HttpClient(config.baseUrl || "http://localhost:11434"),
              outputChannel, 
            );

          await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Generating commit message...",
            cancellable: true,
          }, async (progress, token) => {
            token.onCancellationRequested(() => streamManager.abort());

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
          });
        } catch (error) {
          outputChannel.appendLine(`🔥 Critical error: ${error}`);
          vscode.window.showErrorMessage(
            error instanceof Error ? error.message : "Generation failed",
          );
        }
      },
    ),
  );
}
