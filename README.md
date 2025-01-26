

# AI Commit Message Generator

A VS Code extension that generates Conventional Commit messages using AI, supporting both local and cloud-based models.



## Features

- **Real-Time Streaming**  
  Watch messages generate token-by-token with immediate visual feedback

- **Dual AI Backends**  
  Choose between:
  - 🦙 **Ollama** (local models)
  - 🤖 **OpenAI-Compatible** (LM Studio/Cloud services)

- **Deep Reasoning Capture**  
  Preserve AI's internal thinking process in hidden `<think>` blocks

- **Smart Validation**  
  Auto-validate messages against Conventional Commits specification

- **Diagnostic Logging**  
  Full visibility into AI operations via Output Channel

## Installation

1. Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Its-Satyajit.ai-commit-messege)| [VSIX](https://open-vsx.org/extension/Its-Satyajit/ai-commit-messege) 
2. Set up your AI backend:

### Ollama (Recommended for Local)
```bash

curl -fsSL https://ollama.com/install.sh | sh

ollama run deepseek-r1:8b
```

### LM Studio (OpenAI-Compatible Local)
1. Download [LM Studio](https://lmstudio.ai/)
2. Load any llama2-based model like deepseek-r1-distill-llama-8b
3. Enable Local Server (Menu → Local Server)

## Usage

1. Stage your changes in Source Control
2. Click the **✨ Generate Commit Message** button
3. Review AI-generated message
4. Commit as normal

## Configuration

Configure in `settings.json`:

```json
{
  "commitMessageGenerator.provider": "ollama",
  "commitMessageGenerator.apiUrl": "http://localhost:11434",
  "commitMessageGenerator.model": "deepseek-r1:8b",
  "commitMessageGenerator.temperature": 0.7,
  "commitMessageGenerator.types": [
    "feat", "fix", "docs", "style", "refactor", "test", "chore"
  ]
}
```

| Setting         | Description                              | Default Values                          |
|-----------------|------------------------------------------|-----------------------------------------|
| `provider`      | AI backend provider                      | `ollama`                                |
| `apiUrl`        | Endpoint URL                             | Auto-detected based on provider         |
| `model`         | Model identifier                         | Provider-specific                       |
| `temperature`   | Creativity control (0-1)                 | 0.7                                     |
| `types`         | Allowed commit types                     | Conventional Commits list               |

## Troubleshooting

**No generated message:**
- Verify staged changes exist
- Check model is running (Ollama/LM Studio)
- View logs via `View > Output > AI Commit Message Generator`

**Validation failures:**
- Review configured `types`/`scopes`
- Check message length (72 char limit)

## License


This project is licensed under the [MIT](/LICENSE) License.
