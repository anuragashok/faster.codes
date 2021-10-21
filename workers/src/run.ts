import { Env } from './env'

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
    let url = new URL(request.url)
    return new Response(url.toString())
  }
}

interface RunData {
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
