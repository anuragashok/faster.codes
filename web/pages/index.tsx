import Footer from "@components/Footer";
import Header from "@components/Header";
import Head from "next/head";
import React from "react";
import CodeEditor from "../components/CodeEditor";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto h-full">
        <div className="card lg:card-side bordered">
          <div className="card-body text-center subpixel-antialiased">
            <ul className="w-full steps mb-3">
              <li className="step">Select programming languages</li>
              <li className="step">Write code</li>
              <li className="step">Submit</li>
            </ul>
            <h3 className="text-xl">& then..</h3>
            <h3 className="text-xl">
              Sit back while we evaluate the codes and present you with a
              comparision.
            </h3>
            <h3 className="text-xl underline">
              Share and discuss the results with your colleagues or friends with
              our shareable link!
            </h3>

            {/* <div className="card-actions">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-ghost">More info</button>
            </div> */}
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="grid flex-grow my-6 bordered border-primary-content  rounded-box place-items-center flex-1 indicator">
            <div className="indicator-item  badge badge-info badge-lg badge-outline mr-2">
              A
            </div>
            <CodeEditor />
          </div>
          <div className="divider divider-vertical">vs</div>
          <div className="grid flex-grow my-6 bordered border-primary-content rounded-box place-items-center flex-1 indicator">
            <div className="indicator-item badge indicator-start indicator-top badge-info badge-lg badge-outline ml-2">
              B
            </div>
            <CodeEditor />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
