import {Environment} from "monaco-editor";

declare global {
    declare module '*.pegjs';

    interface Window {
        MonacoEnvironment: Environment;
    }
}