import { Env, RunData } from '../types'
import { customAlphabet } from 'nanoid/async'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 15)

export async function create(request: Request, env: Env) {
  const runData: RunData = await request.json()

  let runId = await nanoid()
  runData.runId = await nanoid()
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

  await sendRunRequest(runId, runData)

  return new Response(
    JSON.stringify({
      runId: runId,
    }),
    { status: 201 },
  )
}

async function sendRunRequest(runId: string, runData: RunData) {
  var headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return fetch('https://executor-api.faster.codes/', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(runData),
    redirect: 'follow',
  })
}
