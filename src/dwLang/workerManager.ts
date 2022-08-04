import { Uri, editor } from 'monaco-editor'
import { DwLangWorker } from './dwLangWorker';
import { languageID } from './config';

export class WorkerManager {
  private worker: editor.MonacoWebWorker<DwLangWorker>;
  private surveyData: any;
  private workerClient: Promise<DwLangWorker>;

  constructor(surveyData) {
    this.worker = null;
    this.surveyData = surveyData;
  }

  private _stopWorker(): void {
    if (this.worker) {
      this.worker.dispose();
      this.worker = null;
    }
    this.workerClient = null;
  }

  public dispose(): void {
    this._stopWorker();
  }

  private getClient(): Promise<DwLangWorker> {
    if (!this.workerClient) {
      this.worker = editor.createWebWorker<DwLangWorker>({
        // module that exports the create() method and returns a `JSONWorker` instance
        moduleId: languageID,
        label: languageID,
        // worker 初始化数据
        createData: {
          languageId: languageID,
          surveyData: this.surveyData,
        },
      });
      this.workerClient = <Promise<DwLangWorker>>this.worker.getProxy();
    }

    return this.workerClient;
  }

  async getLanguageServiceWorker(...resources: Uri[]): Promise<DwLangWorker> {
    const _client: DwLangWorker = await this.getClient();
    await this.worker.withSyncedResources(resources);
    return _client;
  }
}
