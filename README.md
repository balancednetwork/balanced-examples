# Balanced Network Examples

This repo is a collection of code samples to showcase how to execute different operations on the Balanced Network.

## Prerequisites

To be able to run the code samples, first clone the repo and then install the required dependencies:

```bash
git clone https://github.com/balancednetwork/balanced-network-examples.git
cd balanced-network-examples
npm install
```

The sample scripts can run in both testnet and mainnet environments. To switch between the two, set the `NETWORK` environment variable to either `testnet` or `mainnet` (default is `testnet`).

For this create a `.env` file in the root of the project and add the following line:

```bash
NETWORK=testnet
```

Also setup a `PRIVATE_KEY` environment variable in the `.env` file with the private key of the account you want to use to sign transactions.

```bash
NETWORK=testnet
PRIVATE_KEY=0x...
```

If no private key is provided, the scripts that require signing transactions will fail.

## Scripts

The following scripts are available:

- [Query a pool price](./scripts/query-pool-price.js)
- [Make ICON-ICON swap (ICX to TOKEN)](./scripts/make-icon-icon-swap.js)
- [Make ICON-ICON swap (TOKEN to TOKEN)](./scripts/make-icon-icon-swap-2.js)
- [Make ICON-ICON swap (TOKEN to ICX)](./scripts/make-icon-icon-swap-3.js)
- [Make ICON-SPOKE swap (ICX to NATIVE on SPOKE)](./scripts/make-icon-evm-swap.js)
- [Make ICON-SPOKE swap (TOKEN on ICON to TOKEN on SPOKE)](./scripts/make-icon-evm-swap.js)
- (NOT IMPLEMENTED YET)[Make SPOKE-ICON swap](./scripts/make-spoke-icon-swap.js)
- (NOT IMPLEMENTED YET)[Make SPOKE-SPOKE swap](./scripts/make-spoke-spoke-swap.js)


## References
- [Balanced Network](https://balanced.network/)
- [Balanced Network Docs](https://docs.balanced.network/)
- [Balanced Network Contracts Addresses](https://github.com/balancednetwork/balanced-java-contracts/wiki/Contract-Addresses)
- [xCall Contracts Addresses](https://github.com/icon-project/xcall-multi/wiki/xCall-Deployment-Info)
