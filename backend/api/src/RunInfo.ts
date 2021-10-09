export interface Code {
  codeId: string;
  lang: string;
}

export interface RunInfo {
  runId: string;
  codes: Code[];
}
