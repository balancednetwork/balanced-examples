// This script showcase how to make a swap on Balanced
// Network.
// The example is for a swap from ICX (native) on ICON
// Chain to AVAX (native) on Avalanche Chain.
//
// const IconService = require("icon-sdk-js");
const { Web3 } = require("web3");
// const { IconWallet } = IconService.default;
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
    // instantiate providers
    const evmProvider = new Web3(config.network.evm1[config.useNetwork].rpc);

    const evmWallet = evmProvider.eth.accounts.privateKeyToAccount(
      "0x" + privateKey,
    );
    const receiver = `${config.network.evm1[config.useNetwork].xnid}/${evmWallet.address}`;

    // amount to trade
    const amount = 10;

    // slippage of 5%
    const slippage = 0.05;

    // fetch the current price for the icx/sicx pool (0x1)
    // sicx/bnusd pool (0x2) and avax/bnusd pool (0x46)
    const pool1Data = await getPoolsStat("0x1");
    const pool2Data = await getPoolsStat("0x2");
    const pool3Data = await getPoolsStat("0x46");

    const avaxAmount =
      ((amount / (parseInt(pool1Data.result.price, 16) / 10 ** 18)) *
        (parseInt(pool2Data.result.price, 16) / 10 ** 18)) /
      (parseInt(pool3Data.result.price, 16) / 10 ** 18);
    const minAvaxAmount = avaxAmount - avaxAmount * slippage;
    const minAvaxAmountInLoop = minAvaxAmount * 10 ** 18;

    const tradePath = [
      [1, pool1Data.result.base_token],
      [1, pool2Data.result.quote_token],
      [1, pool3Data.result.base_token],
    ];

    const encodedPath = encodePathArray(tradePath);

    const txParams = {
      _minReceive: "0x" + minAvaxAmountInLoop.toString(16),
      _path: encodedPath,
      _receiver: receiver,
    };

    const hash = await icxTransaction(
      config.network.icon[config.useNetwork].contracts.router,
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
