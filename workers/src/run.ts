import { Env, ExecuteRequest } from './models'

export class Run {
  data: RunData = {}
  state: DurableObjectState

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.state.blockConcurrencyWhile(async () => {
      let stored = await this.state.storage?.get<RunData>('data')
      this.data = stored || {}
    })
  }

  async fetch(request: Request) {
    const url = new URL(request.url)
    let path = url.pathname.slice(1).split('/')

    switch (request.method) {
      case 'POST': {
        const runId = path[1]
        const req: ExecuteRequest = await request.json()
        await this.state.storage?.put<RunData>('data', {
          status: 'RUNNING',
          startTime: +new Date(),
          codeRuns: [
            {
              id: runId + '-a',
              code: req.code[0],
            },
            {
              id: runId + '-b',
              code: req.code[1],
            },
          ],
        })
        return new Response(url.toString())
      }
      case 'GET':
        return new Response(
          JSON.stringify(await this.state.storage?.get<RunData>('data')),
        )
      case 'PUT': {
        const req: CodeRunData = await request.json()
        const runData = await this.state.storage?.get<RunData>('data')
        if (runData) {
          Object.assign(
            runData?.codeRuns?.filter((c) => c.id == req.id)[0],
            req,
          )
          await this.state.storage?.put<RunData>('data', runData)
        }

        return new Response(url.toString())
      }
    }
  }
}

interface RunData {
  status?: string
  startTime?: number
  codeRuns?: CodeRunData[]
}

interface CodeRunData {
  id: string
  code: string
  stats?: RunStats
}

interface RunStats {
  duration: RunValues
  mem: RunValues
  cpu: RunValues
}

interface RunValues {
  avg: number
  values: number[]
}
