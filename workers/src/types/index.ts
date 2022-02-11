export interface RunData {
  runId: string
  status?: string
  startTime?: number
  codeRuns: CodeRunData[]
}
export interface CodeRunData {
  id: string
  lang: string
  code: string
  stats?: RunStats
  status?: string
  stage?: Stage
}
export interface RunStats {
  duration: RunValues
  mem: RunValues
  cpu: RunValues
}
export interface RunValues {
  avg: number
  values: number[]
}

enum Stage {
  Draft,
  Submitted,
  Compiling,
  Compiled_Success,
  Compile_Failed,
  Running,
  Run_Success,
  Run_Failed,
  Unknown_Failed,
}

export * from './reqres'
