import {editor, languages} from 'monaco-editor';
import {TextDocument} from 'vscode-languageserver-textdocument';

export class Hover {
    private getVariableTips(word): string {
        return `${word} 题目信息`
    }

    public doHover(
        document: TextDocument,
        position,
        wordInfo: editor.IWordAtPosition,
    ): Promise<languages.Hover> {
        const word = wordInfo?.word;

        const isVariable = word?.startsWith('Q');
        if (isVariable) {
            return Promise.resolve({
                contents: [
                    {
                        value: this.getVariableTips(word),
                        isTrusted: true,
                    },
                ],
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: wordInfo.startColumn,
                    endLineNumber: position.lineNumber,
                    endColumn: wordInfo.endColumn,
                },
            });
        } else {
            return null;
        }
    }
}
