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
    code = code || "";
    onChange(index, { ...codeRunData, code });
  };
  return (
    <>
      <div className="bg-base-300 w-full rounded-t-2xl">
        <DropDown lang={codeRunData.lang} onChange={handleLanguageChange} />
        <Editor
          height="50vh"
          language={codeRunData.lang}
          value={codeRunData.code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ fontSize: 16, fontFamily: "Inconsolata" }}
        />
      </div>
    </>
  );
};

export default CodeEditor;
