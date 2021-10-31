import { CodeRunData, RunData } from "@components/types";

export default async function run(runData: RunData) {
  let runDataClone: RunData = JSON.parse(JSON.stringify(runData));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HTTP}`, {
    method: "POST",
    body: JSON.stringify(runDataClone),
  });

  return (await response.json()).runId as string;
}
