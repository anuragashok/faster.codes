import Editor, { useMonaco } from "@monaco-editor/react";
import DropDown from "@components/Dropdown";
import { useEffect, useState } from "react";
import { CodeRunData } from "./types";

type Props = {
  index: number;
  codeRunData: CodeRunData;
  onChange: (index: number, codeRun: CodeRunData) => void;
};

const CodeEditor: React.FC<Props> = ({ index, codeRunData, onChange }) => {
  let handleLanguageChange = (lang: string) => {
    onChange(index, { ...codeRunData, lang });
  };
  let handleCodeChange = (code: string | undefined) => {
    const base64Code = code ? Buffer.from(code).toString("base64") : "";
    onChange(index, { ...codeRunData, code: base64Code });
  };
  return (
    <>
      <div className="bg-base-300 w-full rounded-t-2xl">
        <DropDown lang={codeRunData.lang} onChange={handleLanguageChange} />{" "}
        <span>support for more languages coming soon</span>
        <Editor
          height="50vh"
          language={codeRunData.lang}
          value={Buffer.from(codeRunData.code, "base64").toString()}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            fontFamily: "Inconsolata",
            minimap: { enabled: false },
            scrollBeyondLastLine: false
          }}
        />
      </div>
    </>
  );
};

export default CodeEditor;
