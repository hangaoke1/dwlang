import {
  languages,
  editor,
  Range,
  MarkerSeverity,
  Position,
  CancellationToken,
  IDisposable,
} from "monaco-editor";
import { DwLangError, WorkerAccessor } from "./languageService/types";
import { languageID } from "./config";
import { dslLog } from "./utils";

export class DwLangCompletionItemProvider
  implements languages.CompletionItemProvider
{
  constructor(
    private readonly _worker: WorkerAccessor,
    private readonly _triggerCharacters: string[]
  ) {}

  public get triggerCharacters(): string[] {
    return this._triggerCharacters;
  }

  async provideCompletionItems(
    model: editor.IReadOnlyModel,
    position: Position,
    context: languages.CompletionContext,
    token: CancellationToken
  ): Promise<languages.CompletionList | undefined> {
    const resource = model.uri;
    const worker = await this._worker(resource);

    const wordInfo = model.getWordAtPosition(position);
    dslLog("[Completion] word info", wordInfo);
    const info = await worker.doComplete(
      resource.toString(),
      position,
      wordInfo
    );

    dslLog("[Completion] suggestion info", info);
    if (!info) {
      return;
    }

    return info;
  }
}

export class DwLangHoverProvider implements languages.HoverProvider {
  constructor(private readonly _worker: WorkerAccessor) {}

  async provideHover(
    model: editor.IReadOnlyModel,
    position: Position,
    token: CancellationToken
  ): Promise<languages.Hover | undefined> {
    let resource = model.uri;

    const worker = await this._worker(resource);

    const wordInfo = model.getWordAtPosition(position);
    dslLog("[Hover] word info", wordInfo);
    const info = await worker.doHover(resource.toString(), position, wordInfo);

    dslLog("[Hover] tips info", info);
    if (!info) {
      return;
    }
    return info;
  }
}

export class DiagnosticsAdapter {
  protected readonly _disposables: IDisposable[] = [];
  private readonly _listener: { [uri: string]: IDisposable } =
    Object.create(null);
  private decorations: string[];

  constructor(private worker: WorkerAccessor) {
    const onModelAdd = (model: editor.IModel): void => {
      let handle: any;

      this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
        // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
        // otherwise if the user is still typing, we cancel the
        clearTimeout(handle);
        handle = setTimeout(() => {
          return this.validate(model);
        }, 500);
      });

      this.validate(model);
    };

    const onModelRemoved = (model: editor.IModel): void => {
      editor.setModelMarkers(model, languageID, []);

      let uriStr = model.uri.toString();
      let listener = this._listener[uriStr];
      if (listener) {
        listener.dispose();
        delete this._listener[uriStr];
      }
    };
    this._disposables.push(editor.onDidCreateModel(onModelAdd));
    this._disposables.push(editor.onWillDisposeModel(onModelRemoved));

    this._disposables.push({
      dispose: () => {
        editor.getModels().forEach(onModelRemoved);
        for (let key in this._listener) {
          this._listener[key].dispose();
        }
      },
    });

    editor.getModels().forEach(onModelAdd);
  }

  private async validate(model: editor.IModel): Promise<void> {
    try {
      const resource = model.uri;
      const worker = await this.worker(resource);
      const markerData: editor.IMarkerData[] = await worker.doValidation(
        resource.toString()
      );

      const markers = [];
      const decorations = [];
      markerData.forEach((data) => {
        if (data.severity === MarkerSeverity.Error) {
          const error = data;
          markers.push(error);

          const decoration = {
            range: new Range(error.startLineNumber, 1, error.endLineNumber, 1),
            options: {
              glyphMarginClassName: "monaco-error-line",
            },
          };
          decorations.push(decoration);
        } else if (data.severity === MarkerSeverity.Warning) {
          markers.push(data);
        }
      });

      // 高亮错误行号
      this.decorations = model.deltaDecorations(this.decorations, decorations);
      // 语法错误、语法警告 code 划线和提示
      editor.setModelMarkers(model, languageID, markers);
    } catch (e) {
      dslLog("[Validation] validate error", e);
    }
  }

  public dispose(): void {
    this._disposables.forEach((d) => d && d.dispose());
    this._disposables.length = 0;
  }
}
