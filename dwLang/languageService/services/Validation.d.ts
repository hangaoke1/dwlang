import { editor } from "monaco-editor";
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare class Validation {
    private warnings;
    constructor();
    doValidate(document: TextDocument): editor.IMarkerData[];
    private customWarning;
}
