# Balanced Examples

This repo is a collection of code samples to showcase how to execute different operations on Balanced.

## Prerequisites

To be able to run the code samples, first clone the repo and then install the required dependencies:

```bash
git clone https://github.com/balancednetwork/balanced-examples.git
cd balanced-examples
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
- [Make SPOKE-SPOKE swap (NATIVE coin on source chain)](./scripts/make-evm-evm-swap.js)
- [Make SPOKE-SPOKE swap (TOKEN on source chain)](./scripts/make-evm-evm-swap-2.js)


## References
- [Balanced website](https://balanced.network/)
- [Balanced app](https://app.balanced.network/)
- [Balanced docs](https://docs.balanced.network/)
- [Balanced contract addresses](https://github.com/balancednetwork/balanced-java-contracts/wiki/Contract-Addresses)
- [xCall contract addresses](https://github.com/icon-project/xcall-multi/wiki/xCall-Deployment-Info)
