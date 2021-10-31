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

export * from './reqres'
