import { handleErrors } from './utils'
import { execute } from './create.handler'
import { Env } from './env'
export { Run } from './run'

export default {
  async fetch(request: Request, env: Env) {
    return await handleErrors(request, async () => {
      let url = new URL(request.url)
      let path = url.pathname.slice(1).split('/')
      switch (request.method) {
        case 'POST':
          return create(await request.json(), env)
        case 'GET':
          return read(await request.json(), env)
        case 'PUT':
          return update(await request.json(), env)
        default:
          return new Response('Not found', { status: 404 })
      }
    })
  },
}
