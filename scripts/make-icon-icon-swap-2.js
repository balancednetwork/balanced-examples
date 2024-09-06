// This script showcase how to make a swap on Balanced
// Network.
// The example is for a swap from bnUSD to BALN token on
// the ICON Blockchain.
//
const IconService = require("icon-sdk-js");
const { IconWallet } = IconService.default;
const config = require("../utils/config");
const {
  getRlpEncodedSwapData,
  icxTransaction,
  getTxResult,
  getPoolsStat,
} = require("../utils/utils");

const { privateKey } = config;

async function main() {
  try {
    // get wallet instance
    const wallet = IconWallet.loadPrivateKey(privateKey);
    const receiver = wallet.getAddress();

    // amount to trade
    const amount = 1;
    const amountInLoop = amount * 10 ** 18;

    // slippage of 5%
    const slippage = 0.05;

    // fetch the current price for the BALN/bnUSD pool
    // the pool id is 0x3
    const poolData = await getPoolsStat("0x3");
    const poolPrice = parseInt(poolData.result.price, 16) / 10 ** 18;

    // minimum amount of BALN to receive with the slippage
    // applied
    const balnAmount = amount / poolPrice;
    const minBalnAmount = balnAmount - balnAmount * slippage;
    const minBalnAmountInLoop = minBalnAmount * 10 ** 18;

    // The following params are required to make a swap
    // they are ordered as follows:
    // [ method, receiver, minAmountToReceive, txPath ]
    // The txPath is an array with the following structure:
    // [ type, tokenAddress ]
    //
    // The params are encoded using RLP and then passed
    // to the _data field of the transaction.
    const params = [
      "_swap",
      receiver,
      minBalnAmountInLoop,
      [1, config.network.icon[config.useNetwork].contracts.baln],
    ];

    const encodedParams = getRlpEncodedSwapData(params);
    const routerContract =
      config.network.icon[config.useNetwork].contracts.router;
    const bnUSDContract =
      config.network.icon[config.useNetwork].contracts.bnusd;
    const hash = await icxTransaction(bnUSDContract, null, "transfer", {
      _data: encodedParams,
      _to: routerContract,
      _value: "0x" + amountInLoop.toString(16),
    });

    const txResult = await getTxResult(hash);
    console.log("Transaction result:");
    console.log(txResult);
  } catch (err) {
    console.log("Error running the script:");
    console.error(err);
  }
}

main();
