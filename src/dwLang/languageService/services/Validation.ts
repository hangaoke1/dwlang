import {editor} from "monaco-editor";
import {TextDocument} from 'vscode-languageserver-textdocument';
import parser from '../../parser/dsl-grammar.pegjs';
import {monacoEditorCopy} from '../types'

export class Validation {
    private warnings: any[]

    constructor() {
        this.warnings = [];
    }

    public doValidate(document: TextDocument): editor.IMarkerData[] {
        try {
            // 每次 validate 清空上一次的 warning
            this.warnings = [];

            const code = document.getText();
            parser.parse(code, {
                _inject: {
                    // 注入 warning 方法，自定义收集 warning
                    warning: this.customWarning,
                },
            });
            return this.warnings;
        } catch (err) {
            const {location} = err;
            const {start, end} = location;
            return [
                {
                    startLineNumber: start.line,
                    startColumn: start.column,
                    endLineNumber: end.line,
                    endColumn: end.column,
                    message: `语法错误：${err.message}`,
                    code: err.found,
                    severity: monacoEditorCopy.MarkerSeverity.Error,
                },
            ];
        }
    }

    private customWarning = (message: string, location: any) => {
        const {start, end} = location;
        this.warnings.push({
            startLineNumber: start.line,
            startColumn: start.column,
            endLineNumber: end.line,
            endColumn: end.column,
            message: `警告：${message}`,
            code: '',
            severity: monacoEditorCopy.MarkerSeverity.Warning,
        });
    };
}
