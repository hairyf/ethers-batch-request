# ethers-batch-request

HTTP batch request is a feature most Ethereum clients support, for example, [Geth](https://geth.ethereum.org/docs/interacting-with-geth/rpc/batch). With batch requests enabled, multiple HTTP requests can be packaged into one single request and sent to the server. Server process this bulk request and returns a bulk result. All of these are done in a single round trip.

This feature can be useful for reducing the load on the server and improving the performance to a certain extent.

`ethers-batch-request` will automatically process the queue and return the correct value:

```sh
# with pnpm
pnpm add ethers-batch-request

# with yarn
yarn add ethers-batch-request
```

```ts
import { BatchContract } from 'ethers-batch-request'
import { providers } from 'ethers'

// BatchContract works the same way as ethers' Contract
const provider = new providers.JsonRpcProvider('https://...')
const contract = new BatchContract('0x...', interface, provider)

// BatchContract will automatically package into an HTTP request
// When there are no new queries, it sends a batch request and returns all the values
const owners = await Promise.all([
  contract.ownerOf(0),
  contract.ownerOf(1),
  contract.ownerOf(2),
  contract.ownerOf(3),
  contract.ownerOf(4),
  contract.ownerOf(5),
])
```

<img height="150" src="https://github.com/hairyf/ethers-batch-request/assets/49724027/2a07fe30-244c-4cd0-9aa1-6bb227a5b75b" /> <img height="150" src="https://github.com/hairyf/ethers-batch-request/assets/49724027/4d2f2c23-34ad-4787-8c20-677debcecdf6" />

> Currently, batch querying is only supported for the Contract.

## License

[MIT](./LICENSE) License © 2023-PRESENT [Hairyf](https://github.com/hairyf)
