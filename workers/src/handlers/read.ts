import { Env } from '../types/reqres'
import { ExecuteResponse } from '../types/reqres'

export async function read(request: Request, env: Env) {
  let url = new URL(request.url)
  let path = url.pathname.slice(1).split('/')
  const runId = path[0]
  let runInternalId = env.RUNDUR.idFromName(runId)
  const runObj = env.RUNDUR.get(runInternalId)

  let newUrl = new URL(request.url)
  newUrl.pathname = '/read'
  return await runObj.fetch(newUrl.toString())
}
