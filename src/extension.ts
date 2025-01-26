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
  const streamManager = new StreamManager();
  const diffProvider = new GitDiffProvider();

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.generateCommitMessage', async () => {
      try {
        const config = loadConfig();
        const diff = await diffProvider.getStagedDiff();
        
        const client = config.provider === 'openai'
          ? new OpenAIProvider(new HttpClient(
              config.baseUrl || 'https://api.openai.com/v1',
              { 'Authorization': `Bearer ${config.apiKey}` }
            ))
          : new OllamaProvider(new HttpClient(
              config.baseUrl || 'http://localhost:11434'
            ));

        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Generating commit message...',
          cancellable: true
        }, async (progress, token) => {
          token.onCancellationRequested(() => streamManager.abort());
          
          return streamManager.handleStream(
            client.createStream(diff, getSystemPrompt, { 
              model: config.model,
              temperature: config.temperature,
              maxTokens: config.maxTokens
            }),
            (content) => progress.report({ message: content })
          ); 
        });
        
      } catch (error) {
        vscode.window.showErrorMessage(
          error instanceof Error ? error.message : 'Generation failed'
        );
      }
    })
  );
}