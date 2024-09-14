// This script showcase how to make a swap on Balanced
// Network.
// The example is for a swap from ICX to bnUSD on which
// the route is ICX -> sICX -> bnUSD.
//
const IconService = require("icon-sdk-js");
const { IconWallet } = IconService.default;
const config = require("../utils/config");
const {
  encodePathArray,
  icxTransaction,
  getTxResult,
  getPoolsStat,
} = require("../utils/utils");

const { privateKey } = config;

async function main() {
  try {
    // amount to trade
    const amount = 1;

    // slippage of 5%
    const slippage = 0.05;

    // fetch the current price of the icx/sicx and
    // sicx/bnUSD pairs to calculate the price of icx/bnUSD
    //
    // The icx/sicx pool Id is 0x1, we use this ID to
    // get the pool data
    const pool1Data = await getPoolsStat("0x1");
    const pool1Price = parseInt(pool1Data.result.price, 16) / 10 ** 18;

    // The sicx/bnUSD pool Id is 0x2
    const pool2Data = await getPoolsStat("0x2");
    const pool2Price = parseInt(pool2Data.result.price, 16) / 10 ** 18;

    // with the prices of the two pools, we can calculate
    // the price of icx/bnUSD
    const icxToSicx = amount / pool1Price;
    const icxToBnUSD = icxToSicx * pool2Price;

    // minimum amount to receive with the slippage added
    const minAmountToReceive = icxToBnUSD - icxToBnUSD * slippage;

    const minAmountToReceiveInLoop = minAmountToReceive * 10 ** 18;
    const minAmountToReceiveInHex =
      "0x" + minAmountToReceiveInLoop.toString(16);

    // trade path
    const tradePath = [
      [1, pool1Data.result.base_token],
      [1, pool2Data.result.quote_token],
    ];
    const encodedPath = encodePathArray(tradePath);

    // get wallet instance
    const wallet = IconWallet.loadPrivateKey(privateKey);
    const receiver = wallet.getAddress();

    const txParams = {
      _minReceive: minAmountToReceiveInHex,
      _path: encodedPath,
      _receiver: receiver,
    };

    // send transaction
    const routerContract =
      config.network.icon[config.useNetwork].contracts.router;
    const hash = await icxTransaction(
      routerContract,
      amount,
      "routeV2",
      txParams,
    );

    const txResult = await getTxResult(hash);
    console.log("Transaction result:");
    console.log(txResult);
  } catch (err) {
    console.log("Error running the script:");
    console.error(err);
  }
}

main();
