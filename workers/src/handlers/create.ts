import { Env, ExecuteRequest } from '../models'
import { ExecuteResponse } from '../models'

export async function create(request: Request, env: Env) {
  const runReq: ExecuteRequest = await request.json()

  let runId = await generateNewRunId(env, request)
  await startRunBackend(runId, runReq)

  const runInternalId = env.RUNDUR.idFromName(runId)
  let newUrl = new URL(request.url)
  newUrl.pathname = `${runId}`
  await env.RUNDUR.get(runInternalId).fetch(newUrl.toString(), {
    method: 'POST',
    body: JSON.stringify(runReq),
  })

  return new Response(
    JSON.stringify({
      runId: runId,
    }),
    { status: 201 },
  )
}

async function generateNewRunId(env: Env, request: Request) {
  let id = env.COUNTER.idFromName('A')
  let obj = env.COUNTER.get(id)
  let resp = await obj.fetch(request.url)
  let runId = await resp.text()

  return runId
}

async function startRunBackend(runId: string, runReq: ExecuteRequest) {
  var headers = new Headers()
  headers.append('Content-Type', 'application/json')

  var raw = JSON.stringify({
    runId: runId,
    codes: [
      {
        lang: runReq.lang[0],
        codeId: runId + '-a',
        code: runReq.code[0],
      },
      {
        lang: runReq.lang[1],
        codeId: runId + '-b',
        code: runReq.code[1],
      },
    ],
  })

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: raw,
    redirect: 'follow',
  }

  console.log(raw)

  return fetch('https://backend-api.faster.codes/', requestOptions)
}
