import { languages, editor, IDisposable, Uri } from "monaco-editor";
import {
  languageExtensionPoint,
  languageID,
  richLanguageConfiguration,
  monarchLanguage,
  themeData,
} from "./config";
import { DwLangWorker } from "./dwLangWorker";
import { WorkerManager } from "./workerManager";
import { WorkerAccessor } from "./languageService/types";
import {
  DwLangCompletionItemProvider,
  DwLangHoverProvider,
  DiagnosticsAdapter,
} from "./LangFeatures";

function asDisposable(disposables: IDisposable[]): IDisposable {
  return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
  while (disposables.length) {
    disposables.pop()!.dispose();
  }
}

export function setupLanguage(surveyData): IDisposable {
  const disposables: IDisposable[] = [];

  // token 分词配置
  disposables.push(
    languages.setMonarchTokensProvider(languageID, monarchLanguage)
  );
  // 语言设置
  disposables.push(
    languages.setLanguageConfiguration(languageID, richLanguageConfiguration)
  );

  // worker 管理
  const workerInstance = new WorkerManager(surveyData);
  const worker: WorkerAccessor = (...uris: Uri[]): Promise<DwLangWorker> => {
    return workerInstance.getLanguageServiceWorker(...uris);
  };
  disposables.push(workerInstance);

  // 错误诊断
  disposables.push(new DiagnosticsAdapter(worker));

  // 代码补全
  disposables.push(
    languages.registerCompletionItemProvider(
      languageID,
      new DwLangCompletionItemProvider(worker, [])
    )
  );

  // 代码悬停提示
  disposables.push(
    languages.registerHoverProvider(languageID, new DwLangHoverProvider(worker))
  );

  return asDisposable(disposables);
}

const init = () => {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      const basePath = process.env.__webpack_public_path__ || "";
      if (label === languageID) {
        return `${basePath}dwLang.worker.js`;
      }
      return `${basePath}editor.worker.js`;
    },
  };

  languages.register(languageExtensionPoint);
  editor.defineTheme(languageID, themeData);
};

init();
