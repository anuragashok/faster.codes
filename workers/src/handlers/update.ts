import { Env } from '../models'
import { ExecuteResponse } from '../models'

export async function update(body: ReadableStream, env: Env) {
  let runId = env.RUNDUR.newUniqueId().toString()
  const res: ExecuteResponse = {
    runId: runId,
  }
  return new Response(JSON.stringify(res), { status: 201 })
}
