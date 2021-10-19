import AceEditor from "react-ace";

import Editor from "@monaco-editor/react";

import { useState } from "react";

const CodeEditor: React.FC = () => {
  const [lang, setLang] = useState("golang");
  return (
    <>
      <select
        className="select select-bordered w-full max-w-xs"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="java">java</option>
        <option value="golang">golang</option>
      </select>
      selected language is {lang}
      <Editor height="90vh" language={lang} value={lang} theme="vs-dark" />
    </>
  );
};

export default CodeEditor;
