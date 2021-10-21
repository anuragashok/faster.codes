import { Env } from './env'
import { ExecuteResponse } from './request'

export async function create(body: ReadableStream, env: Env) {
  let runId = env.RUNDUR.newUniqueId().toString()
  const res: ExecuteResponse = {
    runId: runId,
  }
  return new Response(JSON.stringify(res), { status: 201 })
}

