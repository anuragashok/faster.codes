import { Env } from '../types/reqres'

export async function update(request: Request, env: Env) {
  let url = new URL(request.url)
  let path = url.pathname.slice(1).split('/')
  const runId = path[0]
  const obj = await env.RUNDUR.get(env.RUNDUR.idFromName(runId)).fetch(request)
  return new Response('', { status: 200 })
}
