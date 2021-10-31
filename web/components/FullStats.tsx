import React from "react";
import Stats from "./Stats";
import { RunStats } from "./types";

type Props = { stats: (RunStats | undefined)[] };

const FullStats: React.FC<Props> = ({ stats }) => {
  return (
    <>
      <div className="flex flex-row w-full">
        <div className="grid flex-grow my-6 bordered border-primary-content  rounded-box place-items-center flex-1 indicator">
          <Stats stats={stats[0]} />
        </div>
        <div className="divider divider-vertical text-2xl text-secondary-focus font-bold"></div>
        <div className="grid flex-grow my-6 bordered border-primary-content rounded-box place-items-center flex-1 indicator">
          <Stats stats={stats[1]} />
        </div>
      </div>
    </>
  );
};

export default FullStats;
