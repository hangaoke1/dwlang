import {editor, languages, Position} from 'monaco-editor';
import {monacoLanguagesCopy} from '../types';
import {TextDocument} from 'vscode-languageserver-textdocument';

export class Completion {
    private getKeywordCompletionItems(): languages.CompletionItem[] {
        const keywords = [
            'if',
            'then',
            'show',
            'hide',
        ];
        return keywords.map(keyword => {
            return {
                label: keyword,
                kind: monacoLanguagesCopy.CompletionItemKind.Keyword,
                insertText: keyword,
                insertTextRules: monacoLanguagesCopy.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null
            };
        });
    }

    private getVariableCompletionItems(): languages.CompletionItem[] {
        const variables = new Array(10).fill('题目信息')
        return variables.map((variable, index) => {
            const questionMark = `Q${index + 1}`
            return {
                label: `${questionMark} 题目信息`,
                kind: monacoLanguagesCopy.CompletionItemKind.Keyword,
                insertText: questionMark,
                sortText: new Array(index + 1).fill('1').join(''),
                insertTextRules: monacoLanguagesCopy.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null
            };
        });
    }

    public doComplete(
        document: TextDocument,
        position: Position,
        wordInfo: editor.IWordAtPosition,
    ): languages.CompletionList {
        const word = wordInfo?.word;

        const suggestions = [
            ...this.getKeywordCompletionItems(),
            ...this.getVariableCompletionItems(),
        ];

        return {
            incomplete: true,
            suggestions: suggestions,
        };
    }
}
