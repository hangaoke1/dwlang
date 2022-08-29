import { Uri } from "monaco-editor";
import { DwLangWorker } from "./dwLangWorker";
export declare class WorkerManager {
    private worker;
    private surveyData;
    private workerClient;
    constructor(surveyData: any);
    private _stopWorker;
    dispose(): void;
    private getClient;
    getLanguageServiceWorker(...resources: Uri[]): Promise<DwLangWorker>;
}
