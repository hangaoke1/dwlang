import { editor, languages } from "monaco-editor";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getRangeInfo } from "./utils";

export class Hover {
  private surveyData: any;

  constructor(surveyData: any) {
    this.surveyData = surveyData;
  }

  private getVariableRageTips(word): string {
    const { qNumber, end } = getRangeInfo(word);
    const qstart = qNumber - 1;
    const qend = end;
    const questions = this.surveyData.questions.slice(qstart, qend);

    return questions
      .map((q) => {
        return `Q${q.index + 1} ${q.title}`;
      })
      .join("<br />");
  }
  private getVariableTips(word): string {
    const { qNumber, end } = getRangeInfo(word);
    const q = this.surveyData.questions[qNumber - 1];
    return `${word} ${q.title}`;
  }

  public doHover(
    document: TextDocument,
    position,
    wordInfo: editor.IWordAtPosition
  ): Promise<languages.Hover> {
    const word = wordInfo?.word;
    const isVariableRange = /Q[0-9]*(S[0-9]*)?(A[0-9]*)?~([0-9]+)/i.test(word);
    const isVariable = /Q[0-9]*(S[0-9]*)?(A[0-9]*)?/.test(word);

    if (isVariableRange) {
      return Promise.resolve({
        contents: [
          {
            value: this.getVariableRageTips(word),
            supportHtml: true,
            isTrusted: true,
          },
        ],
        range: {
          startLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: wordInfo.endColumn,
        },
      });
    } else if (isVariable) {
      return Promise.resolve({
        contents: [
          {
            value: this.getVariableTips(word),
            supportHtml: true,
            isTrusted: true,
          },
        ],
        range: {
          startLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: wordInfo.endColumn,
        },
      });
    } else {
      return null;
    }
  }
}
