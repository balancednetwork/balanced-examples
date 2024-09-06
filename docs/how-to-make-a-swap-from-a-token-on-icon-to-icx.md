# How to make a swap from a token on ICON to ICX the native token on ICON Chain.

This guide will show you how to make a swap from a token on ICON to the native coin on ICON Chain, ICX.

In order to execute the swap we need the following information:

- The amount of the token you want to swap
- The contract addresses of all the token involved in the swap (for this case is bnUSD -> sICX -> ICX).
- The pool IDs of the pools involved in the swap.
- Private key of the wallet that holds the token balance.

The source code for the script can be found [here](../scripts/make-icon-icon-swap-3.js).

In this example we are making the swap on testnet and the contract addresses and pool IDs are as follow:

```js
amount = 1;
slippageTolerance = 0.01;
poolIdBnUSDsICX = '0x2';
poolIdsICXICX = '0x1';
bnUSDAddress = 'cx87f7f8ceaa054d46ba7343a2ecd21208e12913c6';
sICXAddress = 'cx2d013cb55781fb54b81d629aa4b611be2daec564';
```

The script will perform the following steps:
- Fetch the pool details for the sicx/icx pool and the bnUSD/sicx pool.
- Calculate the amount of sICX and ICX in the swap.
- Calculate the amount ICX to be received after applying slippage tolerance.
- Encode into the `_data` field of the payload the required information for the swap using RLP.
- Call the `transfer` method of the bnUSD token contract to transfer the token.

After sending the transaction the script will wait for the transaction to be confirmed and will print out the transaction result.

The script can be run using the following command at the root of the project:

```bash
node scripts/make-icon-icon-swap-3.js
```
