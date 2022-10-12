import { editor, languages, Position } from "monaco-editor";
import { monacoLanguagesCopy } from "../types";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getRangeInfo } from "./utils";

export class Completion {
  surveyData: any;

  constructor(surveyData) {
    this.surveyData = surveyData;
  }
  private getKeywordCompletionItems(): languages.CompletionItem[] {
    const keywords = ["if", "then", "show", "hide"];
    return keywords.map((keyword) => {
      return {
        label: keyword,
        kind: monacoLanguagesCopy.CompletionItemKind.Keyword,
        insertText: keyword,
        insertTextRules:
          monacoLanguagesCopy.CompletionItemInsertTextRule.InsertAsSnippet,
        range: null,
      };
    });
  }

  private getVariableCompletionItems(): languages.CompletionItem[] {
    const suggestions = this.surveyData.questions.map((q) => {
      const questionMark = `Q${q.index + 1}`;
      const label = questionMark + " " + q.title;
      const sortText = new Array(q.index + 1).fill("1").join("");
      return {
        label,
        kind: monacoLanguagesCopy.CompletionItemKind.Keyword,
        insertText: questionMark,
        sortText,
        insertTextRules:
          monacoLanguagesCopy.CompletionItemInsertTextRule.InsertAsSnippet,
        range: null,
      };
    });
    return suggestions;
  }

  getRangeVariableCompletionItems(word: string) {
    const { qNumber, end} = getRangeInfo(word)

    const lastSymbol = word.lastIndexOf("~");
    // Q1~
    // prefix: Q1~
    const prefix = word.slice(0, lastSymbol + 1);
    const suggestions = [];
    let sort = "";
    const questions = this.surveyData.questions;
    for (let i = qNumber; i < questions.length; i++) {
      const q = questions[i];
      const questionMark = `Q${q.index + 1}`;
      const label = questionMark + " " + q.title;
      const number = i + 1;
      sort = sort + `1`;
      const item = {
        label,
        kind: monacoLanguagesCopy.CompletionItemKind.Value,
        insertTextRules:
          monacoLanguagesCopy.CompletionItemInsertTextRule.InsertAsSnippet,
        insertText: `Q${qNumber}~${number}`,
        filterText: `${prefix}${number}`,
        sortText: sort,
      };

      suggestions.push(item);
    }

    return suggestions;
  }

  public doComplete(
    document: TextDocument,
    position: Position,
    wordInfo: editor.IWordAtPosition
  ): languages.CompletionList {
    const word = wordInfo?.word;

    let questions = [];
    if (word.indexOf("~") > -1) {
      questions = this.getRangeVariableCompletionItems(word);
    } else {
      questions = this.getVariableCompletionItems();
    }

    const suggestions = [...this.getKeywordCompletionItems(), ...questions];

    return {
      incomplete: true,
      suggestions: suggestions,
    };
  }
}
