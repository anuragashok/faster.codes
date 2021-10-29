import { RunData } from "@components/types";

export default function validate(runData: RunData) {
  const messages: string[] = [];

  const dir = ["left", "right"];
  let index = 0;
  for (const codeRun of runData.codeRuns) {
    if (!codeRun.lang) {
      messages.push(`Please select the language on the ${dir[index]} side`);
    }
    if (!codeRun.code) {
      messages.push(`Please enter code to test on the ${dir[index]} side`);
    }
    index++;
  }

  return messages;
}
