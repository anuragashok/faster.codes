import Head from "next/head";
import React from "react";
import CodeEditor from "../components/CodeEditor";

const Home: React.FC = () => {
  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex-grow">
            <CodeEditor />
          </div>
          <div className="flex-grow">
            <CodeEditor />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
