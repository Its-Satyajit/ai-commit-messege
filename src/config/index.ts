import * as vscode from 'vscode';

export * from "./prompts";

export interface AppConfig {
  provider: "ollama" | "openai";
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  baseUrl?: string;
  types: string[];
  scopes: string[];
}

export function loadConfig(): AppConfig {
  const config = vscode.workspace.getConfiguration("commitMessageGenerator");
  const provider = config.get<"openai" | "ollama">("provider", "openai");
  const baseUrl = config.get<string>("apiUrl");

  return {
    provider,
    model: config.get(
      "model",
      provider === "ollama" ? "deepseek-r1:8b" : "deepseek-r1-distill-llama-8b",
    ),
    temperature: Math.min(Math.max(config.get("temperature", 0.7), 0), 1),
    maxTokens: config.get("maxTokens", 4096),
    apiKey: config.get<string>("apiKey"),

    baseUrl: baseUrl ||
      (provider === "ollama"
        ? "http://localhost:11434"
        : "http://localhost:1234/v1"),
    types: config.get("types", [
      "feat",
      "fix",
      "chore",
      "docs",
      "style",
      "refactor",
      "perf",
      "test",
    ]),
    scopes: config.get("scopes", [
      "api",
      "ui",
      "core",
      "auth",
      "config",
      "deps",
      "docs",
      "test",
      "db",
      "ci",
      "security",
    ]),
  };
}
