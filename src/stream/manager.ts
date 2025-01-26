import * as vscode from 'vscode';

export class StreamManager {
  private abortController = new AbortController();

  async handleStream(
    stream: AsyncIterable<string>,
    onUpdate: (content: string) => void
  ): Promise<string> {
    let fullMessage = '';
    
    try {
      for await (const chunk of stream) {
        if (this.abortController.signal.aborted) {
          throw new Error('Generation aborted');
        }
        
        fullMessage += chunk;
        onUpdate(fullMessage);
      }
      return fullMessage;
    } finally {
      this.updateCommitInput(fullMessage);
    }
  } 

  private updateCommitInput(content: string) {
    const repo = vscode.extensions.getExtension('vscode.git')
      ?.exports?.getAPI(1)?.repositories[0];
    
    if (repo?.inputBox) {
      repo.inputBox.value = content;
    }
  }

  abort() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }
}