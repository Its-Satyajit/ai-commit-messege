import type * as vscode from 'vscode';

import type { HttpClient } from '../core/httpClient';
import type {
  AIProvider,
  ProviderConfig,
} from './aiProvider';

interface OllamaResponse {
	response?: string;
}

export class OllamaProvider implements AIProvider {
	constructor(
		private client: HttpClient,
		private outputChannel: vscode.OutputChannel,
	) {}

	async *createStream(
		diff: string,
		systemPrompt: string,
		config: ProviderConfig,
	): AsyncIterable<string> {
		this.outputChannel.appendLine(
			`🤖 Sending to Ollama (model: ${config.model}):`,
		);
		this.outputChannel.appendLine(`📝 System Prompt: ${systemPrompt}`);
		this.outputChannel.appendLine(`🔧 Config: ${JSON.stringify(config)}`);
		this.outputChannel.appendLine(
			`📄 Diff (${diff.length} chars): ${diff.slice(0, 200)}...`,
		);

		const fullPrompt = `${systemPrompt}\n\nDiff:\n${diff}`;

		const stream = this.client.streamingPost<OllamaResponse>("/api/generate", {
			model: config.model,
			prompt: fullPrompt,
			options: {
				temperature: config.temperature,
				num_predict: config.maxTokens,
			},
			stream: true,
		});

		for await (const chunk of stream) {
			yield chunk.response || "";
		}
	}
}
