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

    switch (path[0]) {
      case 'create':
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
      case 'read':
        return new Response(
          JSON.stringify(await this.state.storage?.get<RunData>('data')),
        )
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
