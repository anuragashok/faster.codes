import React from "react";

type Props = {
  title: string;
  value: number | undefined;
  desc: string;
  unit: string;
  diff: Diff;
};

type Diff = { percent: number; value: number };

const StatBlock: React.FC<Props> = ({ title, value, desc, unit, diff }) => {
  const statClass =
    diff.percent == 0
      ? "text-base-content"
      : diff.percent < 0
      ? "text-success"
      : "text-error";
  const symbol = diff.value > 0 ? "↗︎" : "↘︎";
  const diffText = `${symbol} ${Math.abs(diff.value).toFixed(
    0
  )} ${unit} (${Math.abs(diff.percent).toFixed(0)}%)`;
  return (
    <>
      <div className="stat shadow place-items-center place-content-center">
        <div className="stat-title font-bold text-info opacity-80">{title}</div>
        <div className={"stat-value " + statClass}>
          {value?.toFixed(0)}
          <span className="text-base">{unit}</span>
        </div>
        {diff.value && (
          <div className={"stat-desc text-base opacity-80 " + statClass}>
            {diffText}
          </div>
        )}
        <div className="stat-desc ">{desc}</div>
      </div>
    </>
  );
};

export default StatBlock;
