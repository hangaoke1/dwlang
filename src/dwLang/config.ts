import * as monaco from 'monaco-editor';

type IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
type ILanguage = monaco.languages.IMonarchLanguage;
type IStandaloneThemeData = monaco.editor.IStandaloneThemeData;

export const languageID = 'dwLang';

export const languageExtensionPoint: monaco.languages.ILanguageExtensionPoint = {
    id: languageID,
};

export const richLanguageConfiguration: IRichLanguageConfiguration = {
    // If we want to support code folding, brackets ... ( [], (), {}....), we can override some properties here
    wordPattern: /(-?\d*\.\d\w*)|([^\`\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
};

export const monarchLanguage: ILanguage = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // token 解析规则
            [/#(.*)?/, 'noUseSign'],
            [/\s*(Q[0-9]*(S[0-9]*)?(A[0-9]*)?(~[0-9]+)?)\s*/, 'Question'],
            [/\s*(if|then)\s*/, 'IfStatement'],
            [/\s*(show|hide)\s*/, 'action'],
            [/\s*(> |== |>= |<= |<)\s*/, 'compareSign'],
            [/\s*(and|or|not|\(|\))\s*/, 'linkSign'],
            [/\s*([0-9]\d*)\s*/, 'Number'],
            [/\s*(,)\s*/, 'Gap'],
        ],
    },
    keywords: [
        'if',
        'then',
        'and',
        'or',
        'not',
        'show',
        'hide',
    ],
    operators: ['>', '==', '>=', '<=', '<', 'and', 'or', 'not', '(', ')'],
    whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/#(.*)/, 'comment', '@comment'],
    ],
};

export const themeData: IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        // 配色
        {token: 'noUseSign', foreground: '#BDBDBD'},
        {token: 'Question', foreground: '#9BD7CA'},
        {token: 'IfStatement', foreground: '#F3CD5E'},
        {token: 'action', foreground: '#D38AFF'},
        {token: 'compareSign', foreground: '#F3CD5E'},
        {token: 'linkSign', foreground: '#F3CD5E'},
        {token: 'Number', foreground: '#FF9878'},
        {token: 'Gap', foreground: '#F3CD5E'},
        {token: 'invalid', foreground: '#FFFFFF'},
    ],
    colors: {
        'editor.background': '#282B33',
        'editorLineNumber.background': '#33363E',
        'editor.lineHighlightBackground': '#333844',
    },
};
