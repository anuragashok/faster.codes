import { CodeRunData, RunData } from "@components/types";

export default async function run(runData: RunData) {
  let runDataClone: RunData = JSON.parse(JSON.stringify(runData));

  runDataClone.codeRuns[0].code = Buffer.from(
    runDataClone.codeRuns[0].code
  ).toString("base64");
  runDataClone.codeRuns[1].code = Buffer.from(
    runDataClone.codeRuns[1].code
  ).toString("base64");

  const response = await fetch("https://fastercodes.anurag16890.workers.dev/", {
    method: "POST",
    body: JSON.stringify(runDataClone),
  });

  return (await response.json()).runId as string;
}
