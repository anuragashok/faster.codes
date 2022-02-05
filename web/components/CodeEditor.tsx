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
  const [cache, setCache] = useState(new Map<string, string>());

  let handleLanguageChange = async (lang: string) => {
    let code = "";
    console.log(cache);
    if (cache.has(lang)) {
      let codeFromCache = cache.get(lang);
      if (codeFromCache) {
        code = codeFromCache;
      }
    } else {
      const response = await fetch(`/lang_config/code_templates/${lang}.txt`);
      code = await response.text();
    }
    const base64Code = code ? Buffer.from(code).toString("base64") : "";
    onChange(index, { ...codeRunData, code: base64Code, lang });
  };

  let handleCodeChange = (code: string | undefined) => {
    const base64Code = code ? Buffer.from(code).toString("base64") : "";
    if (code) {
      setCache(cache.set(codeRunData.lang, code));
    }
    console.log(cache);
    onChange(index, { ...codeRunData, code: base64Code });
  };

  return (
    <>
      <div className="bg-base-300 w-full rounded-t-2xl ">
        <div className="grid grid-cols-3 justify-items-stretch">
          <DropDown lang={codeRunData.lang} onChange={handleLanguageChange} />
          <div className="self-center text-center text-black text-bold">
            Block {String.fromCharCode(65 + index)}
          </div>
        </div>
        <Editor
          height="50vh"
          language={codeRunData.lang}
          value={Buffer.from(codeRunData.code, "base64").toString()}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            fontFamily: "Fira Code",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </>
  );
};

export default CodeEditor;
