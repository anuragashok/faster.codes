import Editor, { useMonaco } from "@monaco-editor/react";

import { useEffect, useState } from "react";

const CodeEditor: React.FC = () => {
  const [lang, setLang] = useState("golang");

  return (
    <>
      <div className="container py-2 px-6 mb-5">
        <select
          className="select select-primary select-sm select-secondary w-1/4"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="java">java</option>
          <option value="golang">golang</option>
        </select>
      </div>
      <div className="mockup-window bg-base-300 w-full">
        <Editor height="50vh" language={lang} value={lang} theme="vs-dark" />
      </div>
    </>
  );
};

export default CodeEditor;
