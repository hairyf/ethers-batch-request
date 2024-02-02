import type { CallConfig, CallResponse } from './typings'

const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export async function fetchBatchRequest(url: string, body: CallConfig[]) {
  const response = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body),
  })
  return await response.json() as CallResponse[]
}
