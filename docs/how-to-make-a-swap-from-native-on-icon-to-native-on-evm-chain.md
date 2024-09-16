# How to make a swap from native on ICON to native on EVM chain

The following guide will show you how to make a swap from native on ICON (ICX) to native on EVM chain, for this example the destination chain is Avalanche and the token is AVAX.

In order to execute the swap we need the following information:
- The amount of the token you want to swap
- The contract addresses of all the tokens involved in the swap (for this case ICX -> sICX -> bnUSD -> AVAX)
- The pool IDs of the pools involved in the swap
- Private key of the wallet that holds the balance of the token you want to swap and the receiver wallet (in this case is the same private key for both).

The source code for the script can be found [here](../scripts/make-icon-evm-swap.js).

In this example we are making the swap on mainnet. The following is the initial required information to execute the swap:

```js
amount = 1;
slippageTolerance = 0.01;
poolIdICXToSICX = '0x1';
poolIdSICXToBNUSD = '0x2';
poolIdBNUSDToAVAX = '0x46';
```

The script will perform the following steps:

- Fetch the pool details for all involved pools in the swap.
- Calculate the amount of AVAX to receive taking the slippage tolerance into account.
- Initiate a ICX transaction from the sender account to the Balanced Contract router sending the desired ICX amount.
- Encode into this transaction the required method to call (`routeV2`) and the params to execute the swap.


The script can be run using the following command at the root of the project:

```bash
node scripts/make-icon-evm-swap.js
```
