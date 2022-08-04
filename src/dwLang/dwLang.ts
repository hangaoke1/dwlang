import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { DwLangWorker } from './dwLangWorker';
import { dslLog } from './utils';

self.onmessage = event => {
  worker.initialize((ctx, createData) => {
    dslLog('[Init worker] context', ctx);
    dslLog('[Init worker] createData', createData);
    return new DwLangWorker(ctx, createData);
  });
};
