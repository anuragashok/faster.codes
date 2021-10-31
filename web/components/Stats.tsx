import React from "react";
import Loader from "./Loader";
import { CodeRunData, RunStats } from "./types";

type Props = { code?: CodeRunData };

const Stats: React.FC<Props> = ({ code }) => {
  let stats = code?.stats;
  if (code?.status == undefined) {
    return <Loader />;
  } else if (code?.status == "FAILED") {
    return (
      <div>
        FAILED. <br />
        Sorry this run has failed. At this point, we are unable to provide the
        exact failure reason (support coming soon). <br />
        Common causes include compilation failure or code runs longer than 4
        minutes. <br />
        or maybe a temporary issue on our side, please click RUN AGAIN button
      </div>
    );
  } else if (code?.status == "SUCCESS" && !code.stats) {
    return <div>STATS NOT AVAILABLE</div>;
  } else {
    return (
      <div className="grid-flow-row shadow stats text-info">
        <div className="stat">
          <div className="stat-title text-info font-bold">Execution Time</div>
          <div className="stat-value text-success">
            {Number(stats?.duration.avg).toFixed(0)}
            <span className="text-base">MS</span>
          </div>

          <div className="stat-desc">Average execution time over 10 runs</div>
        </div>
        <div className="stat">
          <div className="stat-title text-info font-bold">CPU</div>
          <div className="stat-value text-error">
            {Number(stats?.cpu.avg).toFixed(0)}
          </div>
          <div className="stat-desc">Average CPU time over 10 runs</div>
        </div>
        <div className="stat">
          <div className="stat-title text-info font-bold">Memory</div>
          <div className="stat-value">
            {stats?.mem.avg}
            <span className="text-base">KB</span>
          </div>
          <div className="stat-desc">
            Average memory consumption time over 10 runs
          </div>
        </div>
      </div>
    );
  }
};

export default Stats;
