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
    return stats && stats[key as StatKey] && stats[key as StatKey].avg;
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
        <div className="flex flex-row w-full mt-4">
          {[0, 1].map((n) => {
            return (
              <>
                {codes[n]?.status == undefined && (
                  <div className="grid-flow-row flex-grow flex-1 border-2 stats shadow-md">
                    <Loader />
                  </div>
                )}
                {codes[n]?.status == "FAILED" && (
                  <div className="grid-flow-row flex-grow flex-1 border-2 stats shadow-md">
                    <div className="stat shadow place-items-center place-content-center self-start">
                      <div className="stat-title font-bold text-info opacity-80">
                        FAILED
                      </div>
                      <div className="stat-desc whitespace-normal opacity-100 mt-4 text-normal">
                        <p className="text-center">
                          Sorry this run has failed.
                        </p>
                        <p className="text-center">
                          At this point, we are unable to provide the exact
                          failure reason (support coming soon).
                        </p>
                        <p className="mt-2">Common causes for this are</p>
                        <ul className="list-disc">
                          <li>Compilation failure</li>
                          <li>Code runs &gt; 4 minutes</li>
                          <li>
                            Temporary issue with the faster.codes platform
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {codes[n]?.status == "SUCCESS" && !codes[n].stats && (
                  <div>STATS NOT AVAILABLE</div>
                )}
                {codes[n]?.status == "SUCCESS" && codes[n].stats && (
                  <>
                    <div className="grid-flow-row flex-grow flex-1 border-2 stats shadow-md">
                      {[EXECUTION_TIME, CPU, MEM].map((v) => {
                        return (
                          <StatBlock
                            key={v.key}
                            title={v.title}
                            value={getStatValue(n, v.key)}
                            desc={v.desc}
                            unit={v.unit}
                            diff={diff(n, v.key)}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
                {n == 0 && (
                  <div className="divider divider-vertical text-xl text-primary-focus font-bold mx-6">
                    <Social />
                  </div>
                )}
              </>
            );
          })}
        </div>
      </>
    );
  }
};

export default FullStats;
