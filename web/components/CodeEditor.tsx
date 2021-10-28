import Editor, { useMonaco } from "@monaco-editor/react";
import DropDown from "@components/Dropdown";
import { useEffect, useState } from "react";

const CodeEditor: React.FC = () => {
  const [lang, setLang] = useState("golang");

  return (
    <>
      <div className="bg-base-300 w-full rounded-t-2xl">
        <div className="indicator-item  badge badge-info badge-lg badge-outline mr-2">
          A
        </div>
        <DropDown />
        <Editor height="50vh" language={lang} value={lang} theme="vs-dark" />
      </div>
    </>
  );
};

export default CodeEditor;
