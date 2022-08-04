import { Uri } from 'monaco-editor';
import { DwLangWorker } from '../dwLangWorker';

export interface DwLangError {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  code: string;
}

export type WorkerAccessor = (...uris: Uri[]) => Promise<DwLangWorker>;

export namespace monacoEditorCopy {
  export enum MarkerSeverity {
    Hint = 1,
    Info = 2,
    Warning = 4,
    Error = 8
  }
}

export namespace monacoLanguagesCopy {
  export enum CompletionItemKind {
    Method = 0,
    Function = 1,
    Constructor = 2,
    Field = 3,
    Variable = 4,
    Class = 5,
    Struct = 6,
    Interface = 7,
    Module = 8,
    Property = 9,
    Event = 10,
    Operator = 11,
    Unit = 12,
    Value = 13,
    Constant = 14,
    Enum = 15,
    EnumMember = 16,
    Keyword = 17,
    Text = 18,
    Color = 19,
    File = 20,
    Reference = 21,
    Customcolor = 22,
    Folder = 23,
    TypeParameter = 24,
    User = 25,
    Issue = 26,
    Snippet = 27,
  }

  export enum CompletionItemInsertTextRule {
    /**
     * Adjust whitespace/indentation of multiline insert texts to
     * match the current line indentation.
     */
    KeepWhitespace = 1,
    /**
     * `insertText` is a snippet.
     */
    InsertAsSnippet = 4,
  }
}

export enum SurveyVariableType {
  question = 'Question',
  subQuestion = 'SubQuestion',
  option = 'Option',
}

export type SurveyVariableNumberRange = {
  type: SurveyVariableType;
  qNumber?: number;
  sNumber?: number;
  oNumber?: number;
  endNumber?: number;
};

export type SurveyVariableNumberInfo = {
  type: SurveyVariableType;
  qNumber?: number;
  sNumber?: number;
  oNumber?: number;
};

export type SurveyVariableIdInfo = {
  type: SurveyVariableType;
  qid?: string;
  sid?: string;
  oid?: string;
};
