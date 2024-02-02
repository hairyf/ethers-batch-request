export interface CallConfig {
  method: string
  params: any[]
  id: number
  jsonrpc: string
}

export interface CallError {
  code: number
  data: string
  message: string
}

export interface CallResponse {
  jsonrpc: string
  id: number
  result: string
  error?: CallError
}
