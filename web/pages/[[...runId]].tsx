import Footer from "@components/Footer";
import Header from "@components/Header";
import { CodeRunData, RunData } from "@components/types";
import React, { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import run from "@libs/run";
import validate from "@libs/validate";
import ErrorModal from "@components/ErrorModal";
import { useRouter } from "next/router";
import { useEffect } from "react";

import useSWR from "swr";

const fetcher = async (url: string) =>
  fetch(url).then(async (res) => await res.json());

const Home: React.FC = () => {
  const router = useRouter();

  const { runId } = router.query;

  const [runData, setRunData] = useState({
    codeRuns: [{}, {}],
  } as RunData);
  const [showError, setShowError] = useState(true);
  const [messages, setMessages] = useState([] as string[]);

  const { data, error } = useSWR(
    "https://fastercodes.anurag16890.workers.dev/" + runId,
    fetcher,
    { fallbackData: runData }
  );

  if(runId){
    
  }
  setRunData(data);

  let handCodeRunDataChange = (index: number, codeRunData: CodeRunData) => {
    setRunData({
      ...runData,
      codeRuns: [
        ...runData.codeRuns.slice(0, index),
        codeRunData,
        ...runData.codeRuns.slice(index + 1),
      ],
    });
  };

  let handleRun = async () => {
    let validationErrors = validate(runData);

    if (validationErrors.length > 0) {
      setMessages(validationErrors);
      setShowError(true);
      return;
    }

    let runId = await run(runData);
    setRunData({
      ...runData,
      runId,
    });

    router.push("/" + runId);
  };

  return (
    <>
      <Header />
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        messages={messages}
      />
      <div className="container mx-auto h-full">
        <div className="card lg:card-side bordered">
          <div className="card-body text-center subpixel-antialiased">
            <ul className="w-full steps mb-3 font-semibold ">
              <li className="step">SELECT LANGUAGES</li>
              <li className="step">WRITE CODES</li>
              <li className="step">RUN & COMPARE</li>
              <li className="step">SHARE</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="grid flex-grow my-6 bordered border-primary-content  rounded-box place-items-center flex-1 indicator">
            <CodeEditor
              index={0}
              codeRunData={runData.codeRuns[0]}
              onChange={handCodeRunDataChange}
            />
          </div>
          <div className="divider divider-vertical text-2xl text-secondary-focus font-bold">
            VS
          </div>
          <div className="grid flex-grow my-6 bordered border-primary-content rounded-box place-items-center flex-1 indicator">
            <CodeEditor
              index={1}
              codeRunData={runData.codeRuns[1]}
              onChange={handCodeRunDataChange}
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="flex-1 ..."></div>
          <div className="flex-none ...">
            <div className="btn btn-lg" onClick={handleRun}>
              {runId ? "RUN AGAIN" : "RUN & COMPARE"}
            </div>
          </div>
          <div className="flex-1 ..."></div>
        </div>
        {JSON.stringify(runData)}
        ---------
        {runId}
      </div>
      <Footer />
    </>
  );
};

export default Home;
