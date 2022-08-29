import { editor, languages } from 'monaco-editor';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare class Hover {
    private getVariableTips;
    doHover(document: TextDocument, position: any, wordInfo: editor.IWordAtPosition): Promise<languages.Hover>;
}
