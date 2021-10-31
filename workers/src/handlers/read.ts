import { addCorsHeaders } from '../cors'
import { RunData } from '../types'
import { Env } from '../types/reqres'
import { ExecuteResponse } from '../types/reqres'

export async function read(request: Request, env: Env) {
  let url = new URL(request.url)
  let path = url.pathname.slice(1).split('/')
  const runId = path[0]

  if (request.headers.get('Upgrade') == 'websocket') {
    console.log('got ws headers')
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
  let runInternalId = env.RUNDUR.idFromName(runId)
  const runObj = env.RUNDUR.get(runInternalId)
  let newUrl = new URL(request.url)
  newUrl.pathname = '/read'
  return await runObj.fetch(newUrl.toString())
}

async function handleErrors(request: Request, func: any) {
  try {
    return await func()
  } catch (err: any) {
    if (request.headers.get('Upgrade') == 'websocket') {
      let pair = new WebSocketPair()
      pair[1].accept()
      pair[1].send(JSON.stringify({ error: err.stack }))
      pair[1].close(1011, 'Uncaught exception during session setup')
      return new Response(null, { status: 101, webSocket: pair[0] })
    } else {
      return new Response(err.stack, { status: 500 })
    }
  }
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
  if (runData.status == 'RUNNING' && !isExpired(runData.startTime)) {
    setTimeout(pollRunData, 2000, env, request, runId, ws)
  } else {
    ws.send('<DONE>')
    ws.close()
  }
}

function isExpired(startTime: number | undefined) {
  if (startTime) {
    var difference = +new Date() - startTime
    var minutes = Math.floor(difference / 1000 / 60)
    return minutes > 5
  } else {
    return true
  }
}
