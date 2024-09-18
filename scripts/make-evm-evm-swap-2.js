// This script showcase how to make a swap on Balanced
// Network.
// The example is for a swap from ICX (native) on ICON
// Chain to AVAX (native) on Avalanche Chain.
//
const config = require("../utils/config");
const { Web3 } = require("web3");
const {
  getRlpEncodedSwapData,
  getPoolsStat,
  depositNativeEvm,
  getContractObjectEvm,
} = require("../utils/utils");
const { ethers } = require("ethers");

async function main() {
  try {
    // get abi and address for xcall contract
    const xcallAbi = config.abi.xcall;
    const xcallAddress = config.network.evm1[config.useNetwork].contracts.xcall;
    const xcallManagerAbi = config.abi.xcallManager;
    const xcallManagerAddress =
      config.network.evm1[config.useNetwork].contracts.xcall_manager;

    const xcallManagerContract = getContractObjectEvm(
      xcallManagerAbi,
      xcallManagerAddress,
    );

    // get the sources for the cross chain transfer
    const responseProtocols = await xcallManagerContract["getProtocols()"]();
    const sources = JSON.parse(JSON.stringify(responseProtocols))[0];

    // instantiate the contract object
    const xcallContract = getContractObjectEvm(xcallAbi, xcallAddress);

    // get fee for cross chain transfer using xcall
    const response = await xcallContract["getFee(string,bool,string[])"](
      config.network.evm3[config.useNetwork].xnid,
      "0x1",
      sources,
    );
    const parsedFee = Number(response) / 10 ** 18;
    if (Number.isNaN(parsedFee)) {
      throw new Error("Failed to parse fee");
    }
    // instantiate providers
    const evmProvider = new Web3(config.network.evm1[config.useNetwork].rpc);

    const evmWallet = evmProvider.eth.accounts.privateKeyToAccount(
      "0x" + config.privateKey,
    );
    const receiver = `${config.network.evm3[config.useNetwork].xnid}/${evmWallet.address}`;

    // amount to trade
    const amountRaw = 0.1;
    let amount = amountRaw + parsedFee;
    amount = Number(amount.toFixed(4));

    const parsedAmountRaw = parseInt(amountRaw * 10 ** 18);
    const parsedAmount = parseInt(amount * 10 ** 18);

    // slippage of 5%
    const slippage = 0.02;

    // fetch the current price for the AVAX/bnUSD pool
    // and ETH/bnUSD pool
    const pool1Data = await getPoolsStat("0x46");
    const pool2Data = await getPoolsStat("0x3b");
    const pool1Price = parseInt(pool1Data.result.price, 16) / 10 ** 18;
    const pool2Price = parseInt(pool2Data.result.price, 16) / 10 ** 18;

    const tokenBAmount = (amountRaw * pool1Price) / pool2Price;

    const minTokenBAmount = tokenBAmount - tokenBAmount * slippage;
    const minTokenBAmountInLoop = parseInt(minTokenBAmount * 10 ** 18);

    const data = [
      "_swap",
      receiver,
      minTokenBAmountInLoop,
      [1, pool1Data.result.quote_token],
      [1, pool2Data.result.base_token],
    ];

    console.log("data");
    console.log(data);
    const encodedData = getRlpEncodedSwapData(data);
    console.log("encodedData");
    console.log(encodedData);
    const routerReceiver = `${config.network.icon[config.useNetwork].xnid}/${config.network.icon[config.useNetwork].contracts.router}`;

    const hash = await depositNativeEvm(
      "0x" + parsedAmountRaw.toString(16),
      routerReceiver,
      "0x" + encodedData,
      "0x" + parsedAmount.toString(16),
    );

    console.log("Transaction result:");
    console.log(hash);
  } catch (err) {
    console.log("Error running the script:");
    console.error(err);
  }
}

main();
