/* eslint-disable ts/no-misused-new */
/* eslint-disable ts/no-redeclare */
import { Contract, type ContractInterface, type Signer, type providers } from 'ethers'
import { isFunction, isSymbol } from './utils'
import { batchContractCall } from './batch'
import { SKIP_FUNCTIONS } from './constants'

interface BatchContract extends Contract {
  new(
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: Signer | providers.Provider | undefined,
  ): BatchContract
}

function BatchContractImplement(
  this: BatchContract,
  addressOrName: string,
  contractInterface: ContractInterface,
  signerOrProvider?: Signer | providers.Provider | undefined,
) {
  const contract = new Contract(addressOrName, contractInterface, signerOrProvider)
  function getter(property: string) {
    if (SKIP_FUNCTIONS.includes(property))
      return contract[property]
    if (isSymbol(property) || property.startsWith('_'))
      return contract[property]
    if (!isFunction(contract[property]))
      return contract[property]
    if (!(property in contract))
      return undefined
    return (...args: any) =>
      batchContractCall(
        contract,
        property,
        ...args,
      )
  }

  const proxy = new Proxy(this, {
    get: (_, property: string) => getter(property),
    set(target, p, newValue) {
      (contract as any)[p] = newValue
      return true
    },
  })

  return proxy
}

export const BatchContract: BatchContract = BatchContractImplement as any
