import { languages, editor, Position, CancellationToken, IDisposable } from "monaco-editor";
import { WorkerAccessor } from "./languageService/types";
export declare class DwLangCompletionItemProvider implements languages.CompletionItemProvider {
    private readonly _worker;
    private readonly _triggerCharacters;
    constructor(_worker: WorkerAccessor, _triggerCharacters: string[]);
    get triggerCharacters(): string[];
    provideCompletionItems(model: editor.IReadOnlyModel, position: Position, context: languages.CompletionContext, token: CancellationToken): Promise<languages.CompletionList | undefined>;
}
export declare class DwLangHoverProvider implements languages.HoverProvider {
    private readonly _worker;
    constructor(_worker: WorkerAccessor);
    provideHover(model: editor.IReadOnlyModel, position: Position, token: CancellationToken): Promise<languages.Hover | undefined>;
}
export declare class DiagnosticsAdapter {
    private worker;
    protected readonly _disposables: IDisposable[];
    private readonly _listener;
    private decorations;
    constructor(worker: WorkerAccessor);
    private validate;
    dispose(): void;
}
