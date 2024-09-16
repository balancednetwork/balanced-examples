# How to make a swap from native on ICON to native on EVM chain

The following guide will show you how to make a swap from a token on ICON (BALN) to native a token on an EVM chain, for this example the destination chain is Avalanche and the token is bnUSD.

In order to execute the swap we need the following information:
- The amount of the token you want to swap
- The contract addresses of all the tokens involved in the swap (for this case BALN -> bnUSD)
- The pool IDs of the pools involved in the swap
- Private key of the wallet that holds the balance of the token you want to swap and the receiver wallet (in this case is the same private key for both).

The source code for the script can be found [here](../scripts/make-icon-evm-swap-2.js).

In this example we are making the swap on mainnet. The following is the initial required information to execute the swap:

```js
amount = 1;
slippageTolerance = 0.01;
poolIdBALNToBNUSD = '0x3';
```

The script will perform the following steps:

- Fetch the pool details for all involved pools in the swap.
- Calculate the amount of BNUSD to receive taking the slippage tolerance into account.
- Initiate the BALN transaction by calling the `transfer` method of the BALN token contract.
- Encode into this transaction the required params to execute the swap.


The script can be run using the following command at the root of the project:

```bash
node scripts/make-icon-evm-swap-2.js
```
