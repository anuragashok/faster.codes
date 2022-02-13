import { CodeRunData, RunData } from '../types'
import { Env, ExecuteRequest } from '../types/reqres'
import { ExecuteResponse } from '../types/reqres'

export async function create(request: Request, env: Env) {
  const runReq: RunData = await request.json()

  let runId = await generateNewRunId(env, request)
  runReq.runId = runId
  runReq.codeRuns[0].id = runId + '-a'
  runReq.codeRuns[1].id = runId + '-b'

  const runInternalId = env.RUNDUR.idFromName(runId)
  let newUrl = new URL(request.url)
  newUrl.pathname = `${runId}`
  await env.RUNDUR.get(runInternalId).fetch(newUrl.toString(), {
    method: 'POST',
    body: JSON.stringify(runReq),
  })

  await startRunBackend(runId, runReq)

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

async function startRunBackend(runId: string, runReq: RunData) {
  var headers = new Headers()
  headers.append('Content-Type', 'application/json')

  var raw = JSON.stringify({
    runId: runId,
    codes: [
      {
        lang: runReq.codeRuns[0].lang,
        codeId: runId + '-a',
        code: runReq.codeRuns[0].code,
      },
      {
        lang: runReq.codeRuns[1].lang,
        codeId: runId + '-b',
        code: runReq.codeRuns[1].code,
      },
    ],
  })

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(runReq),
    redirect: 'follow',
  }

  console.log(raw)

  //return fetch('https://backend-api.faster.codes/', requestOptions)
  return fetch('https://executor-api.faster.codes/', requestOptions)
}
