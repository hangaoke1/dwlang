import { editor, languages, worker } from 'monaco-editor';
import { Completion, Validation, Hover } from './languageService/services';
import { languageID } from './config';
import { TextDocument } from 'vscode-languageserver-textdocument';

type IWorkerContext = worker.IWorkerContext;

export class DwLangWorker {
  private _ctx: IWorkerContext;
  private validation: Validation;
  private completion: Completion;
  private hover: Hover;

  constructor(ctx: IWorkerContext, createData) {
    this._ctx = ctx;

    this.validation = new Validation();
    this.completion = new Completion();
    this.hover = new Hover();
  }

  doValidation(uri: string): Promise<editor.IMarkerData[]> {
    const document = this.getTextDocument(uri);
    return Promise.resolve(this.validation.doValidate(document));
  }

  doComplete(
    uri: string,
    position,
    wordInfo: editor.IWordAtPosition,
  ): Promise<languages.CompletionList> {
    const document = this.getTextDocument(uri);
    console.log(uri, position, wordInfo)
    return Promise.resolve(this.completion.doComplete(document, position, wordInfo));
  }

  doHover(uri: string, position, wordInfo: editor.IWordAtPosition): Promise<languages.Hover> {
    const document = this.getTextDocument(uri);
    return Promise.resolve(this.hover.doHover(document, position, wordInfo));
  }

  private getTextDocument(uri: string): TextDocument {
    const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
    const document = TextDocument.create(uri, languageID, model.version, model.getValue());
    return document;
  }
}
