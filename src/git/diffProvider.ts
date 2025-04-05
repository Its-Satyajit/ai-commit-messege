import * as vscode from "vscode";

export class GitDiffProvider {
  constructor(private outputChannel: vscode.OutputChannel) {}

  async getStagedDiff(repo: any): Promise<string> {
    this.outputChannel.appendLine(
      "🔍 Checking for staged changes in repository: " + repo.rootUri.fsPath,
    );

    const stagedChanges = repo.state.indexChanges;
    if (stagedChanges.length === 0) {
      this.outputChannel.appendLine(
        "No staged changes found in: " + repo.rootUri.fsPath,
      );
      throw new Error("No staged changes to commit");
    }

    const diff = await repo.diff(true);
    this.outputChannel.appendLine(
      `📋 Found diff (${diff.length} chars) for ${repo.rootUri.fsPath}`,
    );

    return diff;
  }
}
