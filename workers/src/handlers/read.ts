import { addCorsHeaders } from '../cors'
import { RunData, Env } from '../types'

export async function read(request: Request, env: Env) {
  let url = new URL(request.url)
  let path = url.pathname.slice(1).split('/')
  const runId = path[0]

  if (request.headers.get('Upgrade') == 'websocket') {
    let pair = new WebSocketPair()
    handleSocket(env, request, runId, pair[1])
    return addCorsHeaders(
      new Response(null, { status: 101, webSocket: pair[0] }),
    )
  } else {
    return await getRunData(env, runId, request)
  }
}

async function getRunData(env: Env, runId: string, request: Request) {
  let ret = await env.RUNKV.get(runId)
  if (ret) {
    console.log('read from KV' + ret)
    return new Response(ret, { status: 200 })
  }
  console.log('not present in KV' + ret)
  let runInternalId = env.RUNDUR.idFromName(runId)
  const runObj = env.RUNDUR.get(runInternalId)
  let newUrl = new URL(request.url)
  newUrl.pathname = '/read'
  return await runObj.fetch(newUrl.toString())
}

async function handleSocket(
  env: Env,
  request: Request,
  runId: string,
  ws: WebSocket,
) {
  ws.accept()

  pollRunData(env, request, runId, ws)
}

async function pollRunData(
  env: Env,
  request: Request,
  runId: string,
  ws: WebSocket,
) {
  let runDataRes = await getRunData(env, runId, request)
  let runData: RunData = await runDataRes.json()
  ws.send(JSON.stringify(runData))
  if (runData.status == 'RUNNING') {
    setTimeout(pollRunData, 5000, env, request, runId, ws)
  } else {
    ws.send('<DONE>')
    ws.close()
  }
}
