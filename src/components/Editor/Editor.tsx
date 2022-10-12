import * as React from "react";
import { editor, IDisposable } from "monaco-editor";
import { languageID } from "../../dwLang/config";
import { setupLanguage } from "../../dwLang/setup";
import surveyData from '../../dwLang/surveyMock'

import "./index.css";

interface IEditorProps {}

const Editor: React.FC<IEditorProps> = () => {
  const editorNodeRef = React.useRef();
  const editorInsRef = React.useRef<editor.IStandaloneCodeEditor>(null);
  const languageInsRef = React.useRef<IDisposable>(null);

  React.useEffect(() => {
    languageInsRef.current = setupLanguage(surveyData);

    const editorNode = editorNodeRef.current;
    if (editorNode) {
      // 创建编辑器
      editorInsRef.current = editor.create(editorNode, {
        language: languageID,
        theme: languageID,
        // 滚动条的缩略图
        minimap: { enabled: false },
        // 显示行号
        selectOnLineNumbers: true,
        // 行号左侧的 margin 内容，可以展示错误 icon 等一些标记内容
        glyphMargin: true,
        // 右键菜单
        contextmenu: false,
        // 自适应布局
        automaticLayout: true,
        padding: {
          top: 8,
          bottom: 8,
        },
        fontSize: 16,
        lineNumbersMinChars: 2,
        lineDecorationsWidth: "0px",
        // 补全信息是否展示 icon
        suggest: {
          showIcons: false,
        },
        value: "# 这里是注释\n# if Q2 then hide Q3\n# if Q4 then show Q6\n",
      });
    }

    return () => {
      // 销毁语言的补全、hover、校验、worker 等
      languageInsRef.current.dispose();
      // 销毁编辑器
      editorInsRef.current.dispose();
    };
  }, []);

  return <div ref={editorNodeRef} style={{ height: "90vh" }} />;
};

export default Editor;
