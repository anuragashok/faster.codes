import { Env } from './env'
import { ExecuteResponse } from './request'

export async function read(body: ReadableStream, env: Env) {
  let roomObject = env.RUNDUR.idFromString('12345')
  const res: ExecuteResponse = {
    runId: '12345',
  }
  return new Response(JSON.stringify(res), { status: 201 })
}
