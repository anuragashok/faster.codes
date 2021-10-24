import { Env, ExecuteRequest } from '../models'
import { ExecuteResponse } from '../models'
import * as base32 from 'base32'

export async function create(request: Request, env: Env) {
  const runReq: ExecuteRequest = await request.json()

  let id = env.COUNTER.idFromName('A')
  let obj = env.COUNTER.get(id)
  let resp = await obj.fetch(request.url)
  let runId = await resp.text()

  const res: ExecuteResponse = {
    runId: runId,
    ...runReq,
  }
  await startRunBackend(runId, runReq)

  const runInternalId = env.RUNDUR.idFromName(runId)

  let newUrl = new URL(request.url)
  newUrl.pathname = '/create'
  await env.RUNDUR.get(runInternalId).fetch(newUrl.toString())

  return new Response(JSON.stringify(res), { status: 201 })
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

function base16decode(str: any) {
  return str.replace(/([A-fa-f0-9]{2})/g, function (m: any, g1: any) {
    return String.fromCharCode(parseInt(g1, 16))
  })
}
