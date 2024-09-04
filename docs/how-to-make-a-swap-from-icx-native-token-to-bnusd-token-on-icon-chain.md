# How to make a swap from ICX native token to bNUSD token on ICON chain

This guide will show you how to make a swap from ICX native token to bNUSD token on ICON chain.

In order to execute the swap we need the following information:

- The amount of ICX you want to swap and the slippage tolerance.
- The contract addresses of all the tokens involved in the swap (for this case the route is ICX -> sICX -> bnUSD)
- The pool IDs of the pools involved in the swap.
- Private key of the wallet that holds the ICX tokens.


The source code for the script can be found [here](../scripts/make-icon-icon-swap.js)

In this example we are making the swap on testnet and the contract addresses and pool IDs are as follows:

```js
amount = 1;
slippageTolerance = 0.01;
poolIdICXsICX = '0x1';
poolIdsICXbnUSD = '0x2';
sicxAddress = 'cx2d013cb55781fb54b81d629aa4b611be2daec564';
bnUSDAddress = 'cx87f7f8ceaa054d46ba7343a2ecd21208e12913c6';
```

The script will perform the following steps:
- Fetch the pool details for the ICX/sICX pool.
- Fetch the pool details for the sICX/bnUSD pool.
- From the ICX/sICX pool, calculate the amount of sICX tokens that will be received for the given amount of ICX tokens.
- From the sICX/bnUSD pool, calculate the amount of bnUSD tokens that will be received for the given amount of sICX tokens.
- Calculate the minimum amount of bnUSD tokens that should be received after applying the slippage tolerance.
- Encode the trade path with RLP encoding.
- Send the amount of ICX tokens to the Router contract on balanced network and call the `routerV2` method with the encoded trade path and the minimum amount of bnUSD tokens that should be received.


After sending the transaction the script will wait for the transaction to be confirmed and will print out the transaction result.

The script can be run using the following command at the root of the project:

```bash
node scripts/make-icon-icon-swap.js
```
