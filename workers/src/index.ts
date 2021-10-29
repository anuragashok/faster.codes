import { handleErrors } from './utils'
import { create, read, update } from './handlers'
import { Env } from './types'
import { handleOptions, addCorsHeaders } from './cors'

export { Run } from './run'
export { Counter } from './counter'

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
          return addCorsHeaders(await update(request, env))
        case 'OPTIONS':
          return handleOptions(request)
        default:
          return new Response('Not found', { status: 404 })
      }
    })
  },
}
