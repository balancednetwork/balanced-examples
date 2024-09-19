# How to make a swap from native coin on non-ICON chain to any other asset on any supported chain.

The following guide will show you how to make a swap from native coin on non-ICON chain to another asset on any supported chain.

In this example we are making a swap from AVAX on Avalanche chain to ETH on BASE chain.

In order to execute the swap we need the following information:
- The amount of the token you want to swap
- The contract addresses of all the tokens involved in the swap (for this case AVAX -> bnUSD -> ETH)
- The pool IDs of the pools involved in the swap
- Private key of the wallet that holds the balance of the token you want to swap and the receiver wallet (in this case is the same private key for both).

The source code for the script can be found [here](../scripts/make-evm-evm-swap.js).

In this example we are making the swap on mainnet. The following is the initial required information to execute the swap:

```js
amount = 0.1;
slippageTolerance = 0.02;
poolIdAVAXtoBNUSD = '0x46';
poolIdBNUSDtoETH = '0x3b';
```

The script will perform the following steps:

- Fetch the pool details for all involved pools in the swap.
- Calculate the amount of ETH to receive taking the slippage tolerance into account.
- Encode the transaction data using RLP.
- Execute the transaction by calling the `depositNative` method of the Balanced Asset Manager contract on the source chain.

The script can be run using the following command at the root of the project:

```bash
node scripts/make-icon-evm-swap.js
```
