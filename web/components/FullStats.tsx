import React from "react";
import Loader from "./Loader";
import Social from "./Social";
import StatBlock from "./StatBlock";
import { CodeRunData, RunStats } from "./types";

const EXECUTION_TIME = {
  key: "duration",
  title: "Execution Time",
  desc: "Average execution time over 10 runs",
  unit: "ms",
};
const CPU = {
  key: "cpu",
  title: "CPU Time",
  desc: "Average CPU time over 10 runs",
  unit: "ms",
};
const MEM = {
  key: "mem",
  title: "Memory",
  desc: "Average memory consumption time over 10 runs",
  unit: "kb",
};
type Props = { codes: CodeRunData[] };

type StatKey = keyof RunStats;

type Diff = { percent: number; value: number };

const FullStats: React.FC<Props> = ({ codes }) => {
  const getStatValue = (n: number, key: string) => {
    const stats = codes[n].stats;
    return stats && stats[key as StatKey].avg;
  };

  const diff = (n: number, key: string): Diff => {
    const currStat = getStatValue(n, key);
    const otherStat = getStatValue((n + 1) % 2, key);

    if (currStat != undefined && otherStat != undefined) {
      return {
        percent: ((currStat - otherStat) * 100) / otherStat,
        value: currStat - otherStat,
      };
    } else {
      return { percent: 0, value: 0 };
    }
  };

  if (codes[0].status == undefined && codes[1].status == undefined) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="w-full flex flex-row  drop-shadow-lg  stats mb-2">
          {codes[0].stats && codes[1].stats && <Social />}
        </div>

        <div className="flex flex-row w-full">
          {[0, 1].map((n) => {
            return (
              <>
                {/* <div className="grid flex-grow my-6 bordered border-primary-content  rounded-box place-items-center flex-1 indicator"> */}
                <div className="grid-flow-row flex-grow shadow stats">
                  {[EXECUTION_TIME, CPU, MEM].map((v) => {
                    return (
                      <StatBlock
                        key={n}
                        title={v.title}
                        value={getStatValue(n, v.key)}
                        desc={v.desc}
                        unit={v.unit}
                        diff={diff(n, v.key)}
                      />
                    );
                  })}
                </div>
                {n == 0 && (
                  <div className="divider divider-vertical text-xl text-primary-focus font-bold" />
                )}
              </>
            );
          })}
        </div>

        {/* {[EXECUTION_TIME, CPU, MEM].map((v) => {
          return (
            <div className="w-full flex flex-row  drop-shadow-lg  stats mb-2" key={v.key}>
              {[0, 1].map((n) => {
                return (
                  <StatBlock key={n}
                    title={v.title}
                    value={getStatValue(n, v.key)}
                    desc={v.desc}
                    unit={v.unit}
                    diff={diff(n, v.key)}
                  />
                );
              })}
            </div>
          );
        })} */}
        <div className="w-full flex flex-row  drop-shadow-lg  stats mb-2">
          {codes[0].stats && codes[1].stats && <Social />}
        </div>
      </>
    );
  }
};

export default FullStats;
