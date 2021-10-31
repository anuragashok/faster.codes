import React from "react";
import Loader from "./Loader";
import Stats from "./Stats";
import { CodeRunData, RunStats } from "./types";

type Props = { codes: CodeRunData[] };

const FullStats: React.FC<Props> = ({ codes }) => {
  if (codes[0].status == undefined && codes[0].status == undefined) {
    return <Loader />;
  } else {
    return (
      <div className="flex flex-row w-full">
        <div className="grid flex-grow my-6 bordered border-primary-content  rounded-box place-items-center flex-1 indicator">
          <Stats code={codes[0]} />
        </div>
        <div className="divider divider-vertical text-2xl text-secondary-focus font-bold"></div>
        <div className="grid flex-grow my-6 bordered border-primary-content rounded-box place-items-center flex-1 indicator">
          <Stats code={codes[1]} />
        </div>
      </div>
    );
  }
};

export default FullStats;
