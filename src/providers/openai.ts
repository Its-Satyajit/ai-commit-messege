import type * as vscode from 'vscode';

import type { HttpClient } from '../core/httpClient';
import type { OpenAIChunk } from '../types';
import type {
  AIProvider,
  ProviderConfig,
} from './aiProvider';

export class OpenAIProvider implements AIProvider {
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
			`🤖 Sending to OpenAI (model: ${config.model}):`,
		);
		this.outputChannel.appendLine(`📝 System Prompt: ${systemPrompt}`);
		this.outputChannel.appendLine(`🔧 Config: ${JSON.stringify(config)}`);
		this.outputChannel.appendLine(
			`📄 Diff (${diff.length} chars): ${diff.slice(0, 200)}...`,
		);

		const stream = this.client.streamingPost<OpenAIChunk>("/chat/completions", {
			model: config.model,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: diff },
			],
			temperature: config.temperature,
			max_tokens: config.maxTokens,
			stream: true,
		});

		for await (const chunk of stream) {
			const content = chunk.choices[0]?.delta?.content || "";
			yield content;
		}
	}
}
