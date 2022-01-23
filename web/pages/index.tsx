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

  const [socketUrl, setSocketUrl] = useState("");
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

  useEffect(() => {
    if (runData.runId) {
      setSocketUrl(`${process.env.NEXT_PUBLIC_API_WS}/${runData.runId}`);
    }
  }, [runData]);

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

    if (runBtn.current) {
      runBtn.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setRunData({
      ...runData,
      runId: undefined,
    });

    let runId = await run(runData);
    setRunData({
      ...runData,
      runId,
    });

    router.push("/?runId=" + runId, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>faster.codes</title>
      </Head>
      <Header />
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        messages={messages}
      />
      <div className="container mx-auto h-full">
        {/* <div className="card lg:card-side bordered">
          <div className="card-body text-center subpixel-antialiased">
            <ul className="w-full steps mb-3 font-semibold ">
              <li className="step">SELECT LANGUAGES</li>
              <li className="step">WRITE CODES</li>
              <li className="step">RUN & COMPARE</li>
              <li className="step">SHARE</li>
            </ul>
          </div>
        </div> */}
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
    return "COMPARE";
  }
  if (
    runData.codeRuns[0].status == undefined &&
    runData.codeRuns[1].status == undefined
  ) {
    return "PLEASE WAIT...";
  }
  return "RUN AGAIN";
}

export default Home;
