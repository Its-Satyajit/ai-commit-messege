export interface OpenAIChunk {
		id: string;
		object: string;
		created: number;
		model: string;
		choices: Array<{
			delta: {
				content?: string;
			};
			index: number;
			finish_reason: null | string;
		}>;
	}

export interface OllamaChunk {
		message?: { content?: string };
	}

export type ProviderResponse = OpenAIChunk | OllamaChunk;
