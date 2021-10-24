export interface Env {
  RUNDUR: DurableObjectNamespace
  RUNKV: KVNamespace
  COUNTER: DurableObjectNamespace
}

export interface ExecuteRequest {
  lang: string[]
  code: string[]
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
