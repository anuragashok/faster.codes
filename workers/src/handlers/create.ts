import { Env, ExecuteRequest } from '../models'
import { ExecuteResponse } from '../models'

export async function create(request: Request, env: Env) {
  const runReq: ExecuteRequest = await request.json()
  let runId = env.RUNDUR.newUniqueId().toString()
  const res: ExecuteResponse = {
    runId: runId,
    ...runReq,
  }
  return new Response(JSON.stringify(res), { status: 201 })
}

async function createRunBackend() {
  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  var raw = JSON.stringify({
    runId: 123,
    codes: [
      {
        lang: 'java11',
        codeId: 456,
        code: 'aW1wb3J0IGphdmEudXRpbC4qOwoKcHVibGljIGNsYXNzIE1haW4gewogICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nIGFyZ3NbXSkgewogICAgICAgIExpc3Q8SW50ZWdlcj4gaW50cyA9IG5ldyBBcnJheUxpc3Q8PigpOwogICAgICAgIGZvcihpbnQgaT0wOyBpPD1NYXRoLnBvdygyLDIyKTtpKyspewogICAgICAgICAgICBpbnRzLmFkZChpKTsgICAgICAKICAgICAgICB9CiAgICAgICAgLy8gYWN0dWFsIGNvZGUgdG8gdGVzdCBzdGFydHMgaGVyZQogICAgICAgIExpc3Q8SW50ZWdlcj4gZXZlbiA9IG5ldyBBcnJheUxpc3Q8PigpOwogICAgICAgIGZvcihpbnQgaT0wOyBpPGludHMuc2l6ZSgpOyBpKyspewogICAgICAgICAgICBpZihpbnRzLmdldChpKSUyPT0wKXsKICAgICAgICAgICAgICAgIGV2ZW4uYWRkKGludHMuZ2V0KGkpKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KfQ==',
      },
      {
        lang: 'java11',
        codeId: 789,
        code: 'aW1wb3J0IGphdmEudXRpbC4qOwppbXBvcnQgamF2YS51dGlsLnN0cmVhbS4qOwoKcHVibGljIGNsYXNzIE1haW4gewogICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nIGFyZ3NbXSkgewogICAgICAgIExpc3Q8SW50ZWdlcj4gaW50cyA9IG5ldyBBcnJheUxpc3Q8PigpOwogICAgICAgIGZvcihpbnQgaT0wOyBpPD1NYXRoLnBvdygyLDIyKTtpKyspewogICAgICAgICAgICBpbnRzLmFkZChpKTsgICAgICAKICAgICAgICB9CiAgICAgICAgLy8gYWN0dWFsIGNvZGUgdG8gdGVzdCBzdGFydHMgaGVyZQogICAgICAgIExpc3Q8SW50ZWdlcj4gZXZlbiA9IGludHMucGFyYWxsZWxTdHJlYW0oKS5maWx0ZXIoaSAtPiBpJTI9PTApLmNvbGxlY3QoQ29sbGVjdG9ycy50b0xpc3QoKSk7CiAgICB9Cn0=',
      },
    ],
  })

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  return fetch(
    'https://3000-harlequin-wildcat-w9nautsx.ws-us17.gitpod.io/',
    requestOptions,
  )
}
