import { editor, languages, Position } from 'monaco-editor';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare class Completion {
    private getKeywordCompletionItems;
    private getVariableCompletionItems;
    doComplete(document: TextDocument, position: Position, wordInfo: editor.IWordAtPosition): languages.CompletionList;
}
