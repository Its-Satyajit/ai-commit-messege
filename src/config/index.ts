import * as vscode from 'vscode';

import { DEFAULT_TYPES } from './prompts';

export * from './prompts';

export interface AppConfig {
  provider: 'ollama' | 'openai'; 
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  baseUrl?: string;
  types: string[];
}

export function loadConfig(): AppConfig {
  const config = vscode.workspace.getConfiguration('commitMessageGenerator');
  const provider = config.get<'openai' | 'ollama'>('provider', 'openai');
  const baseUrl = config.get<string>('baseUrl'); 

  return {
    provider,
    model: config.get('model', provider === 'ollama' ? 'deepseek-r1:8b' : 'gpt-4'), 
    temperature: Math.min(Math.max(config.get('temperature', 0.7), 0), 1),
    maxTokens: config.get('maxTokens', 4096),
    apiKey: config.get<string>('apiKey'),
    baseUrl: baseUrl || (provider === 'ollama' ? 'http://localhost:11434' : undefined),
    types: config.get('types', DEFAULT_TYPES)
  };
}

export { SYSTEM_PROMPT as getSystemPrompt } from './prompts';