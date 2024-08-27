# AI Commit Message VS Code Extension

Welcome to the **AI Commit Message** extension for Visual Studio Code! This extension helps you generate clear and concise commit messages using AI, ensuring your commit history is structured and easy to understand.

## Features

-   **Automated Commit Message Generation**: Automatically generates commit messages based on the changes in your Git repository.
-   **Configurable Settings**: Customize the AI model, API URL, commit message format, and more according to your needs.
-   **Integration with VS Code**: Seamlessly integrates into the VS Code environment, adding a button to the Source Control tab for easy commit message generation.

## Getting Started

### Installation

1. **Install from VS Code Marketplace**: You can install the extension directly from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Its-Satyajit.ai-commit-messege).

2. **Install from GitHub**: Alternatively, you can download the extension from the [GitHub releases page](https://github.com/Its-Satyajit/ai-commit-messege/releases) and install it manually.

### Prerequisites

-   **Visual Studio Code**: Ensure you have Visual Studio Code installed. The extension supports VS Code version 1.92.0 and above.
-   **Git**: Make sure Git is installed and properly configured in your environment.
-   **Local LLM or API Setup**: To generate commit messages using AI, you'll need an API endpoint or a local language model (LLM). For an easy local LLM setup, consider using [LM Studio](https://lmstudio.ai/).

## How to Use AI Commit Message Extension

### Step-by-Step Guide to Generate a Commit Message

1. **Ensure Git Changes**: Make sure you have staged or unstaged changes in your Git repository. The extension requires some changes to generate a meaningful commit message.

2. **Open the Source Control Tab**: Navigate to the Source Control tab in Visual Studio Code. This is where you manage your Git repositories and commit changes.

3. **Generate Commit Message**: In the Source Control tab, you will see a **Generate Commit Message** button. Click this button to start the process of generating a commit message.

4. **View Generated Message**: After clicking the button, the AI model will analyze the changes in your repository and generate a commit message. The generated commit message will automatically populate in the Git input box in VS Code, ready for you to review and commit.

### How the Extension Works

The AI Commit Message extension uses an AI model to analyze your Git repository's current changes. It identifies the type of changes made (such as bug fixes, new features, or documentation updates) and generates a commit message that adheres to the [Conventional Commits](https://www.conventionalcommits.org/) format. This ensures your commit history is structured, informative, and easy to understand.

## Configuration Options

The extension provides several configuration options to customize its behavior:

-   **API URL** (`commitMessageGenerator.apiUrl`): The URL of the API endpoint used to generate commit messages. Ensure this URL is correctly pointing to your message generation service.
-   **Model** (`commitMessageGenerator.model`): The model identifier used for generating commit messages. Ensure the model specified is available and correctly configured.
-   **Temperature** (`commitMessageGenerator.temperature`): The temperature setting for the model output, which controls the randomness of the generated commit message. Higher values produce more diverse outputs.
-   **Max Tokens** (`commitMessageGenerator.maxTokens`): The maximum number of tokens (words or pieces of words) that the model is allowed to generate in a commit message.
-   **API Key** (`commitMessageGenerator.apiKey`): The API key required to authenticate requests to the commit message generation service. Ensure this key is kept secure and private.
-   **Commit Types** (`commitMessageGenerator.types`): A list of commit types that the extension will recognize and use to categorize commit messages. You can customize this list based on your project's needs.
-   **Commit Scopes** (`commitMessageGenerator.scopes`): A list of commit scopes that the extension will recognize and include in commit messages. Customize this list to align with the scopes relevant to your project.

### How to Configure

1. **Open Settings**: Go to `File` > `Preferences` > `Settings` (or use the shortcut `Ctrl + ,` on Windows/Linux or `Cmd + ,` on macOS).

2. **Search for AI Commit Message**: In the search bar, type "AI Commit Message" to filter settings related to the extension.

3. **Adjust Settings**: Modify the settings as per your requirements. Changes are automatically saved.

## Troubleshooting

-   **No Active Git Repository Found**: Ensure that you have a Git repository initialized and that it is opened in Visual Studio Code.
-   **API Key Missing**: Make sure you have set the API key in the extension's settings if required by your setup.
-   **Failed to Fetch Git Changes**: Check if your Git is properly configured and that there are actual changes in your repository.

## Feedback and Support

If you encounter any issues or have suggestions for improvements, please visit the [GitHub Issues page](https://github.com/Its-Satyajit/ai-commit-messege/issues) to report them.

## Contributing

Welcome contributions! If you’d like to contribute, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Its-Satyajit/ai-commit-messege/blob/main/LICENSE) file for more details.
