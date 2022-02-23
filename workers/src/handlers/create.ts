import { Env, RunData } from '../types'

export async function create(request: Request, env: Env) {
  const runData: RunData = await request.json()

  let runId = await generateNewRunId(env, request)
  runData.runId = runId
  runData.codeRuns[0].id = runId + '-a'
  runData.codeRuns[1].id = runId + '-b'
  runData.status = 'RUNNING'

  const runInternalId = env.RUNDUR.idFromName(runId)
  let newUrl = new URL(request.url)
  newUrl.pathname = `${runId}`
  await env.RUNDUR.get(runInternalId).fetch(newUrl.toString(), {
    method: 'POST',
    body: JSON.stringify(runData),
  })

  await startRunBackend(runId, runData)

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

async function startRunBackend(runId: string, runData: RunData) {
  var headers = new Headers()
  headers.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(runData),
    redirect: 'follow',
  }

  return fetch('https://executor-api.faster.codes/', requestOptions)
}
