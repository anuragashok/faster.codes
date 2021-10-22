export interface Env {
  RUNDUR: DurableObjectNamespace
  RUNKV: KVNamespace
}

export interface ExecuteRequest {
  fileA: string
  fileB: string
}

export interface ExecuteResponse {
  runId: string
}

export interface ReadRequest {
  runId: string
}

export interface ReadResponse {
  runId: string
}
