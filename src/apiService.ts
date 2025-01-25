import axios from 'axios';
import * as vscode from 'vscode';

import type { Config } from "./config.js";

function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

function replaceMultipleSpacesWithTab(input: string): string {
  return input.replace(/ {4}/g, "\t");
}

async function sendPrompt(
	prompt: string,
	config: Config,
): Promise<string | null> {
	const payload = {
		model: config.model,
		messages: [
			{
				role: "system",
				content: `<Assistant_Info> Mr_AI, created by Its-Satyajit, has knowledge up to ${Date.now()}. It answers questions based on this knowledge and clarifies its cutoff date when relevant. It cannot access URLs, links, or videos, and asks users to provide relevant text or images when needed. Mr_AI approaches controversial topics with care, avoiding labeling information as sensitive or objective. It excels at solving complex problems by breaking them down into simpler components and using step-by-step reasoning. </Assistant_Info> <Task_Handling> Mr_AI handles both simple and complex tasks with precision. For complex problems, it divides the task into smaller, manageable steps and solves each systematically. When working on coding, logical reasoning, or problem-solving, Mr_AI uses detailed, step-by-step analysis to ensure clarity and accuracy. It assists with tasks involving popular opinions regardless of its own views. For obscure topics, it warns about possible hallucinations and advises users to verify citations since it lacks access to databases or search engines. </Task_Handling> <Interaction_Style> Mr_AI avoids unnecessary apologies and filler phrases like "Certainly" or "Absolutely." It provides concise answers but switches to detailed responses for more intricate tasks or when asked for specifics. For coding, math, and problem-solving, Mr_AI follows a clear, methodical process, explaining each step. Code explanations are provided only if requested. For lengthy tasks, it breaks them into parts, seeking user feedback as it completes each section. Users can give feedback via the thumbs-down button if dissatisfied. </Interaction_Style> <Image_Handling> Mr_AI is "face-blind" and cannot recognize individuals from images. It discusses named individuals but never implies facial recognition. For any image-based task, Mr_AI summarizes the content and repeats instructions before proceeding. </Image_Handling> <Language_and_Tone> Mr_AI communicates in the user’s language and follows these guidelines for tasks like analysis, coding, problem-solving, creative writing, teaching, and more. It prioritizes clarity and logical structure, especially for complex or abstract inquiries, ensuring responses are as accurate and systematic as possible. </Language_and_Tone>`,
			},
			{ role: "user", content: prompt },
			{
				role: "assistant",
				content: `
            Please return only the commit message formatted according to the Conventional Commits specification:
            - A **type** with the appropriate GitHub emoji.
            - An optional **scope**.
            - A concise **description** of the change.
            Optionally include:
            - A **body** for detailed information, starting with \`BREAKING CHANGE:\`.
            - A **footer** for metadata like issue numbers or links.
            Only return the formatted commit message.
        `,
			},
		],
		temperature: config.temperature,
		max_tokens: config.maxTokens,
		stream: config.stream,
	};

	try {
		const response = await axios.post(config.apiUrl, payload, {
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
				"Content-Type": "application/json",
			},
		});

		if (
			Array.isArray(response.data.choices) &&
			response.data.choices.length > 0
		) {
			const message = response.data.choices[0]?.message?.content?.trim();
			if (message) {
				return message;
			}
			console.error("Invalid message structure in API response.");
			vscode.window.showErrorMessage(
				"Failed to generate commit message: Invalid message structure in API response.",
			);
		} else {
			console.error("No choices found in API response.");
			vscode.window.showErrorMessage(
				"Failed to generate commit message: No choices found in API response.",
			);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error sending commit message: ${error.message}`);
			vscode.window.showErrorMessage(
				`Failed to generate commit message: ${error.message}`,
			);
		} else {
			console.error("Error sending commit message: An unknown error occurred.");
			vscode.window.showErrorMessage(
				"Failed to generate commit message: An unknown error occurred.",
			);
		}
	}

	return null;
}

export async function sendCommitMessage(
	changes: string,
	config: Config,
): Promise<string | null> {
	if (!config.apiKey) {
		console.error("API key is missing. Cannot send commit message.");
		vscode.window.showErrorMessage(
			"API key is missing in the extension settings.",
		);
		return null;
	}

	const promptBase = `Based on the provided diffs, generate a Conventional Commit message that strictly follows the Conventional Commits specification. 
            The commit message must include:
            - A **type** with the appropriate GitHub emoji. Choose from ${config.types.join(
							", ",
						)}.
            - An optional **scope**. Choose from ${config.scopes.join(", ")}.
            - A concise **description** of the change.
            **Diffs**:
            ${changes}`;

	const staticTokenUsage = estimateTokens(promptBase);
	const responseTokenBuffer = 200;
	const maxPromptLength =
		config.maxTokens - staticTokenUsage - responseTokenBuffer;

	if (estimateTokens(changes) > maxPromptLength) {
		const chunkSize = maxPromptLength;
		let start = 0;
		const responses: string[] = [];

		while (start < changes.length) {
			const end = Math.min(start + chunkSize, changes.length);
			const chunk = changes.substring(start, end);
			const prompt = `${replaceMultipleSpacesWithTab(
				promptBase.replace("${changes}", chunk),
			)}`;

			const response = await sendPrompt(prompt, config);
			if (response) {
				responses.push(response);
			} else {
				return null;
			}

			start = end;
		}

		return responses.join("\n\n---\n\n"); // Use a separator to distinguish between chunks
	}
		const prompt = `${replaceMultipleSpacesWithTab(promptBase)}`;
		return await sendPrompt(prompt, config);
}
