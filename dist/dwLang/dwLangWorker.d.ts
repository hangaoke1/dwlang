import { editor, languages, worker } from 'monaco-editor';
declare type IWorkerContext = worker.IWorkerContext;
export declare class DwLangWorker {
    private _ctx;
    private validation;
    private completion;
    private hover;
    constructor(ctx: IWorkerContext, createData: any);
    doValidation(uri: string): Promise<editor.IMarkerData[]>;
    doComplete(uri: string, position: any, wordInfo: editor.IWordAtPosition): Promise<languages.CompletionList>;
    doHover(uri: string, position: any, wordInfo: editor.IWordAtPosition): Promise<languages.Hover>;
    private getTextDocument;
}
export {};
