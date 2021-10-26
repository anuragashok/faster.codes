import { Env } from './models'

export class Counter {
  value: number = 100000
  state: DurableObjectState

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    // `blockConcurrencyWhile()` ensures no requests are delivered until
    // initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      let stored = await this.state.storage?.get<number>('value')
      this.value = stored || 100000
    })
  }

  // Handle HTTP requests from clients.
  async fetch(request: Request) {
    let currentValue = ++this.value
    await this.state.storage?.put('value', this.value)
    return new Response(currentValue.toString(32))
  }
}
