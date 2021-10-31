import { RunStats } from "./types";

type Props = { stats?: RunStats };

const Stats: React.FC<Props> = ({ stats }) => {
  return (
    <>
      {!stats && (
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      )}
      {stats && (
        <div className="grid-flow-row shadow stats text-info">
          <div className="stat">
            <div className="stat-title">Execution Time</div>
            <div className="stat-value">{stats?.duration.avg}</div>
            <div className="stat-desc">Average execution time over 10 runs</div>
          </div>
          <div className="stat">
            <div className="stat-title">CPU</div>
            <div className="stat-value">{stats?.cpu.avg}</div>
            <div className="stat-desc">Average CPU time over 10 runs</div>
          </div>
          <div className="stat">
            <div className="stat-title">Memory</div>
            <div className="stat-value">{stats?.mem.avg}</div>
            <div className="stat-desc">
              Average memory consumption time over 10 runs
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stats;
