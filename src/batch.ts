import type { Contract } from 'ethers'
import mitt from 'mitt'
import type { CallConfig, CallResponse } from './typings'
import { fetchBatchRequest } from './request'
import { createDeferred } from './utils'

const emitter = mitt<{ [key: string]: CallResponse[] }>()
const stack: CallConfig[] = []
let queue = 1
let timer: null | NodeJS.Timeout
let id = 0

export function batchContractCall<T extends Contract, K extends keyof T>(
  contract: T,
  method: K,
  ...args: Parameters<T[K]>
) {
  const deferred = createDeferred<ReturnType<T[K]>>()
  const fragment = method as string
  const provider = contract.provider as any
  const rpc = provider?.connection?.url
    || provider?.provider?.connection?.url
    || provider?.providerConfigs?.[0]?.provider?.connection?.url

  if (rpc === 'eip-1193:')
    throw new Error('Wallet not supported')

  const data = contract.interface.encodeFunctionData(fragment, args || [])
  const index = stack.push({
    method: 'eth_call',
    id: id++,
    jsonrpc: '2.0',
    params: [{ data, to: contract.address }, 'latest'],
  })
  timer && clearTimeout(timer)
  timer = setTimeout(requests, 50)

  emitter.on(`calls_${queue}`, resolved)

  function requests() {
    const current = queue
    const configs = [...stack]
    stack.splice(0, index)
    fetchBatchRequest(rpc, configs)
      .then(data => emitter.emit(`calls_${current}`, data))
    queue++
  }
  function resolved(responses: CallResponse[]) {
    const response = responses[index - 1]
    if (response.error) {
      deferred.reject(new Error(response.error.message || 'Unknown'))
      return
    }
    if (response.result === '0x') {
      deferred.resolve(undefined as any)
      return
    }
    const result = contract.interface.decodeFunctionResult(
      fragment,
      response.result,
    )
    deferred.resolve(result.length > 1
      ? result
      : result[0])
  }

  return deferred
}
