# How to make a swap from a token on a non-ICON chain to another asset on any supported chain

The following guide will show you how to make a swap from a token (non native coin) on non-ICON chain to another asset on any supported chain.

In this example we are making a swap from USDC on BASE chain to AVAX on Avalanche chain.

In order to execute the swap we need the following information:
- The amount of the token you want to swap
- The contract addresses of all the tokens involved in the swap (for this case USDC -> bnUSD -> AVAX)
- The pool IDs of the pools involved in the swap
- Private key of the wallet that holds the balance of the token you want to swap and the receiver wallet (in this case is the same private key for both).

The source code for the script can be found [here](../scripts/make-evm-evm-swap-2.js).

In this example we are making the swap on mainnet. The following is the initial required information to execute the swap:

```js
amount = 1;
slippageTolerance = 0.02;
poolIdUSDCtoBNUSD = '0x44';
poolIdBNUSDtoAVAX = '0x46';
```

The script will perform the following steps:

- Fetch the pool details for all involved pools in the swap.
- Calculate the amount of AVAX to receive taking the slippage tolerance into account.
- Send a transaction calling the `approve` method of the token contract on the source chain. This is required to allow the Balanced Asset Manager contract to spend the token.
- Encode the transaction data using RLP and execute the transaction by calling the `deposit` method of the Balanced Asset Manager contract on the source chain.

The script can be run using the following command at the root of the project:

```bash
node scripts/make-icon-evm-swap-2.js
```
