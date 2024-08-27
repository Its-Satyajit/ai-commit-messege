# AI Commit Message VS Code Extension - User Guide

## Table of Contents

1. [Introduction to AI Commit Message Extension](#introduction-to-ai-commit-message-extension)
2. [How to Install AI Commit Message Extension](#how-to-install-ai-commit-message-extension)
3. [How to Configure AI Commit Message Extension](#how-to-configure-ai-commit-message-extension)
4. [How to Use AI Commit Message Extension](#how-to-use-ai-commit-message-extension)
5. [Commands and Shortcuts for AI Commit Message Extension](#commands-and-shortcuts-for-ai-commit-message-extension)
6. [Troubleshooting AI Commit Message Extension](#troubleshooting-ai-commit-message-extension)
7. [Contributing to AI Commit Message Extension](#contributing-to-ai-commit-message-extension)
8. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
9. [License Information](#license-information)

## Introduction to AI Commit Message Extension

The **AI Commit Message** extension for Visual Studio Code automates the creation of commit messages for your Git repositories by leveraging artificial intelligence. This VS Code extension analyzes your code changes and generates commit messages that adhere to the [Conventional Commits](https://www.conventionalcommits.org/) standard, making your commit history more consistent and readable.

## How to Install AI Commit Message Extension

### Prerequisites

-   **Visual Studio Code**: Version `1.92.0` or higher.
-   **Git**: Ensure Git is set up and working in your development environment.

### Installation Steps

1. Open **Visual Studio Code**.
2. Navigate to the **Extensions** view by clicking on the Extensions icon in the Activity Bar.
3. In the search bar, type **"AI Commit Message"**.
4. Click **Install** to add the AI Commit Message extension to your VS Code.

Alternatively, you can install the extension manually by downloading the `.vsix` file from the [GitHub repository](#) and selecting **Install from VSIX...** in the Extensions view.

## How to Configure AI Commit Message Extension

To make the most out of the AI Commit Message extension, you need to configure it properly. Configuration options can be accessed by navigating to `File > Preferences > Settings` or pressing `Ctrl + ,` (or `Cmd + ,` on macOS) in Visual Studio Code and searching for **"AI Commit Message"**.

### Configuration Options

-   **API URL (`commitMessageGenerator.apiUrl`)**:  
    The endpoint URL for the API used to generate commit messages. Make sure this URL points to a valid and active message generation service.  
    _Default:_ `http://127.0.0.1:1234/v1/chat/completions`

-   **Model Identifier (`commitMessageGenerator.model`)**:  
    Specifies the AI model used for generating commit messages. Ensure the specified model is correctly set up.  
    _Default:_ `bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/Meta-Llama-3.1-8B-Instruct-IQ3_XS.gguf`

-   **Temperature Setting (`commitMessageGenerator.temperature`)**:  
    Controls the variability of the generated commit messages. Higher values result in more diverse messages.  
    _Default:_ `0.7`

-   **Maximum Tokens (`commitMessageGenerator.maxTokens`)**:  
    Limits the number of tokens (words or sub-words) the AI can use to generate a commit message.  
    _Default:_ `5000`

-   **API Key (`commitMessageGenerator.apiKey`)**:  
    Required for authenticating API requests. Make sure to keep this key secure.  
    _Default:_ `your_api_key`

-   **Commit Types (`commitMessageGenerator.types`)**:  
    A customizable list of commit types recognized by the extension. You can modify this list based on your project requirements.  
    _Default:_ `["build", "chore", "ci", "docs", "style", "refactor", "perf", "test"]`

-   **Commit Scopes (`commitMessageGenerator.scopes`)**:  
    A customizable list of commit scopes that the extension recognizes. This can be tailored to fit the specific scopes of your project.  
    _Default:_ `["parser", "ui"]`

## How to Use AI Commit Message Extension

### Step-by-Step Guide to Generate a Commit Message

1. **Ensure Git Changes**: Make sure you have staged or unstaged changes in your Git repository.
2. **Open Command Palette**: Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) to open the Command Palette.
3. **Run Command**: Type **"Generate Commit Message"** and select the `Generate Commit Message` command.
4. **View Generated Message**: The AI model will analyze the changes, generate a commit message, and populate it in the Git input box in VS Code.

### How the Extension Works

The AI Commit Message extension fetches the current changes in your repository, analyzes the content to determine commit types and scopes, and uses the AI model to generate a Conventional Commit message. This process ensures that your commit messages are meaningful, structured, and follow a standard format.

## Commands and Shortcuts for AI Commit Message Extension

-   **Generate Commit Message (`extension.generateCommitMessage`)**:  
    This command analyzes your Git changes and generates a commit message using AI. It can be accessed via the Command Palette or the Source Control menu.

## Troubleshooting AI Commit Message Extension

### Common Problems and Solutions

-   **No Active Git Repository Found**:  
    Make sure your workspace has an active Git repository. This extension needs a Git repository to generate commit messages.

-   **Failed to Fetch Git Changes**:  
    This error usually occurs if the extension cannot access Git changes. Ensure that Git is installed correctly and that there are changes in your repository.

-   **API Key is Missing**:  
    The extension requires an API key to authenticate with the message generation service. Make sure to configure the API key in the settings.

-   **No Changes Detected**:  
    If there are no changes in your Git repository, the extension will not generate a commit message. Ensure you have made and staged changes before generating a message.

### Debugging Tips

You can view detailed error messages and logs by opening the Output panel (`View > Output`) and selecting **AI Commit Message** from the drop-down menu.

## Contributing to AI Commit Message Extension

Contributions are always welcome! If you find a bug, have a feature request, or want to contribute code, please [open an issue](#) or submit a pull request on the GitHub repository.

### Development Setup

1. **Clone the Repository**: Clone the extension's GitHub repository to your local machine.
2. **Install Dependencies**: Run `npm install` to set up the development environment.
3. **Open in VS Code**: Open the project folder in Visual Studio Code.
4. **Compile and Test**: Use `npm run watch` to compile the extension and press `F5` to open a new VS Code window with the extension loaded.

## Frequently Asked Questions (FAQ)

### What is the Conventional Commits format?

The Conventional Commits format is a specification for writing consistent commit messages. It uses a structured format that includes a type, an optional scope, and a concise description, making it easier to automate versioning and generate changelogs.

### Can I Use My Own AI Model with This Extension?

Yes, you can configure the extension to use your own AI model by specifying the model identifier in the settings. Ensure the model is accessible via the provided API URL.

### How Do I Update the AI Commit Message Extension?

You can update the extension through the Extensions view in VS Code. If you've installed it manually, download the latest version from the [GitHub repository](#) and reinstall it.

## License Information

The AI Commit Message extension is licensed under the [MIT License](#). For more details, see the LICENSE file in the repository.
