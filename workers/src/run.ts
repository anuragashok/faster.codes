import { addCorsHeaders } from './cors'
import { Env, RunData, CodeRunData } from './types'

export class Run {
  data?: RunData
  state: DurableObjectState
  env: Env

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
    this.state.blockConcurrencyWhile(async () => {
      let stored = await this.state.storage?.get<RunData>('data')
      this.data = stored
    })
  }

  async fetch(request: Request) {
    const url = new URL(request.url)
    let path = url.pathname.slice(1).split('/')

    switch (request.method) {
      case 'POST': {
        const runId = path[0]
        const req: RunData = await request.json()
        await this.state.storage?.put<RunData>('data', req)
        return new Response(url.toString())
      }
      case 'GET':
        return addCorsHeaders(
          new Response(
            JSON.stringify(await this.state.storage?.get<RunData>('data')),
          ),
        )
      case 'PUT': {
        const req: CodeRunData = await request.json()
        const runData = await this.state.storage?.get<RunData>('data')

        console.log(req)
        if (runData) {
          Object.assign(
            runData?.codeRuns?.filter((c) => c.id == req.id)[0],
            req,
          )

          if (
            runData?.codeRuns?.filter((c) => c.status == 'SUCCESS').length == 2
          ) {
            runData.status = 'SUCCESS'
          } else if (
            runData?.codeRuns?.filter((c) => c.status == 'FAILED').length > 1
          ) {
            runData.status = 'FAILED'
          }

          if (
            runData?.codeRuns?.filter((c) => (c.status == 'SUCCESS' || c.status == 'FAILED')).length == 2
          ) {
            console.log('move to KV and delete durable object after 70 seconds')
            this.env.RUNKV.put(runData.runId, JSON.stringify(runData))
            setTimeout(() => {
              console.log('deleting from durable object')
              this.state.storage?.delete('data')
            }, 70000)
          }

          await this.state.storage?.put<RunData>('data', runData)
        }

        return new Response(url.toString())
      }
    }
  }
}
