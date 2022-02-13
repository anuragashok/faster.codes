import { handleErrors } from './utils'
import { create, read, update } from './handlers'
import { Env } from './types'
import { handleOptions, addCorsHeaders } from './cors'

export { Run } from './run'
export { Counter } from './counter'

const WORKER_TOKEN_HEADER_KEY = 'X-WORKER-TOKEN'

export default {
  async fetch(request: Request, env: Env) {
    return await handleErrors(request, async () => {
      let url = new URL(request.url)

      switch (request.method) {
        case 'POST':
          return addCorsHeaders(await create(request, env))
        case 'GET':
          return read(request, env)
        case 'PUT':
          // if (
          //   (await env.RUNKV.get('WORKER_TOKEN')) ==
          //   request.headers.get(WORKER_TOKEN_HEADER_KEY)
          // ) {
          //   return addCorsHeaders(await update(request, env))
          // } else {
          //   return new Response('Auth error', {
          //     status: 403,
          //   })
          // }
          console.log(request)
          return addCorsHeaders(await update(request, env))
        case 'OPTIONS':
          return handleOptions(request)
        default:
          return new Response('Not found', { status: 404 })
      }
    })
  },
}
