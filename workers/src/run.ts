import { Env } from './models'

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
    switch (url.pathname) {
      case '/create':
        await this.state.storage?.put<RunData>('data', {
          status: 'RUNNING',
          startTime: +new Date(),
        })
        return new Response(url.toString())
      case '/read':
        return new Response(
          JSON.stringify(await this.state.storage?.get<RunData>('data')),
        )
    }
  }
}

interface RunData {
  status?: string
  startTime?: number
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
