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
import useWebSocket, { ReadyState } from "react-use-websocket";
import Stats from "@components/Stats";
import FullStats from "@components/FullStats";
import Head from "next/head";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

const Home: React.FC = () => {
  let runBtn = React.createRef<HTMLDivElement>();

  const router = useRouter();
  const [messages, setMessages] = useState([] as string[]);
  const [runData, setRunData] = useState({
    codeRuns: [{ code: "" }, { code: "" }],
  } as RunData);
  const [showError, setShowError] = useState(false);
  const runId = router.query?.runId ? router.query.runId : "dummy";
  console.log(runId);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${process.env.NEXT_PUBLIC_API_WS}/${runId}`
  );

  useEffect(() => {
    if (lastMessage !== null && !lastMessage.data.startsWith("<")) {
      console.log("got new data " + lastMessage.data);
      setRunData(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

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
    // clear old data and use only code and lang fields
    let newRunData = {
      codeRuns: [
        {
          code: runData.codeRuns[0].code,
          lang: runData.codeRuns[0].lang,
        },
        {
          code: runData.codeRuns[1].code,
          lang: runData.codeRuns[1].lang,
        },
      ],
    } as RunData;

    let validationErrors = validate(newRunData);

    if (validationErrors.length > 0) {
      setMessages(validationErrors);
      setShowError(true);
      return;
    }

    if (runBtn.current) {
      runBtn.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    console.log(newRunData);
    let runId = await run(newRunData);
    setRunData({
      ...runData,
      runId,
    });
    router.push("/?runId=" + runId, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>&#123; faster.codes &#125;</title>
      </Head>
      <Header />
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        messages={messages}
      />
      <div className="container mx-auto h-full">
        <div className="card text-center">
          <div className="card-body  p-2">
            <h1 className="card-title text-primary text-3xl">
              What runs faster?
            </h1>
            <p className="text-md antialiased text-lg">
              <ul className="w-full steps">
                <li className="step step-info">
                  Select Runtime & Write Code (Block A)
                </li>
                <li className="step step-info">
                  Select Runtime & Write Code (Block B)
                </li>
                <li className="step step-info">Compare</li>
                <li className="step step-info">View Results</li>
              </ul>
            </p>
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
          <div className="divider divider-vertical text-xl text-primary-focus font-bold">
            vs
          </div>
          <div className="grid flex-grow my-6 bordered border-primary-content rounded-box place-items-center flex-1 indicator">
            <CodeEditor
              index={1}
              codeRunData={runData.codeRuns[1]}
              onChange={handCodeRunDataChange}
            />
          </div>
        </div>
        <div className="flex flex-row w-full mt-3" ref={runBtn}>
          <div className="flex-1 ..."></div>
          <div className="flex-none ...">
            <div className="btn btn-lg btn-primary" onClick={handleRun}>
              {getRunButtonText(runData)}
            </div>
          </div>
          <div className="flex-1 ..."></div>
        </div>
        {runData.runId && (
          <FullStats codes={[runData.codeRuns[0], runData.codeRuns[1]]} />
        )}
      </div>
      <Footer />
    </>
  );
};

function getRunButtonText(runData: RunData): string {
  if (!runData.runId) {
    return "Compare";
  }
  if (
    runData.codeRuns[0].status == undefined &&
    runData.codeRuns[1].status == undefined
  ) {
    return "COMPARING...";
  }
  return "Compare Again";
}

export default Home;
