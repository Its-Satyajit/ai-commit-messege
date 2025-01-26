// Add proper error handling and exports
import * as vscode from 'vscode';

export class GitDiffProvider {  // <- Add 'export'
  async getStagedDiff(): Promise<string> {
    const gitExtension = vscode.extensions.getExtension('vscode.git');
    if (!gitExtension?.isActive) {
      throw new Error('Git extension not available');
    }
  
    const api = gitExtension.exports.getAPI(1);
    const repo = api.repositories[0];
    
    if (!repo) {
      throw new Error('No Git repository found');
    }
  
    // Get staged changes
    const stagedChanges = await repo.state.indexChanges;
    if (stagedChanges.length === 0) {
      throw new Error('No staged changes to commit');
    }
  
    // Get diff for staged changes
    return repo.diffIndexWithHEAD();
  }
}