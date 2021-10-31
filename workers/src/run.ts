import { addCorsHeaders } from './cors'
import { Env, ExecuteRequest, RunData, CodeRunData } from './types'

export class Run {
  data?: RunData
  state: DurableObjectState

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
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
        await this.state.storage?.put<RunData>('data', {
          status: 'RUNNING',
          startTime: +new Date(),
          codeRuns: [
            {
              id: runId + '-a',
              code: req.codeRuns[0].code,
              lang: req.codeRuns[0].lang,
            },
            {
              id: runId + '-b',
              code: req.codeRuns[1].code,
              lang: req.codeRuns[0].lang,
            },
          ],
        })
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

        if (runData) {
          Object.assign(
            runData?.codeRuns?.filter((c) => c.id == req.id)[0],
            req,
          )
          // TODO
          if (
            runData?.codeRuns?.filter((c) => c.stats == undefined).length == 0
          ) {
            runData.status = 'COMPLETED'
          }

          await this.state.storage?.put<RunData>('data', runData)
        }

        return new Response(url.toString())
      }
    }
  }
}
