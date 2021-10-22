import { handleErrors } from './utils'
import { create, read, update } from './handlers'
import { Env } from './models'
export { Run } from './run'

export default {
  async fetch(request: Request, env: Env) {
    return await handleErrors(request, async () => {
      let url = new URL(request.url)

      switch (request.method) {
        case 'POST':
          return create(await request.json(), env)
        case 'GET':
          let runId = url.pathname
          return read(await request.json(), env)
        case 'PUT':
          return update(await request.json(), env)
        default:
          return new Response('Not found', { status: 404 })
      }
    })
  },
}
