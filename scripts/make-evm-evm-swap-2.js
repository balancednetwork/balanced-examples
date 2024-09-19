// This script showcase how to make a swap on Balanced
// Network.
// The example is for a swap from USDC on BASE chain
// Chain to AVAX (native) on Avalanche Chain.
//
const config = require("../utils/config");
const { ethers } = require("ethers");
const {
  getRlpEncodedSwapData,
  getPoolsStat,
  depositTokenEvm,
  getContractObjectEvm,
} = require("../utils/utils");

const EVM_PROVIDER = new ethers.JsonRpcProvider(
  config.network.evm3[config.useNetwork].rpc,
);
const EVM_SIGNER = new ethers.Wallet("0x" + config.privateKey, EVM_PROVIDER);

async function main() {
  try {
    // get abi and address for all relevant contracts
    const xcallAbi = config.abi.xcall;
    const xcallAddress = config.network.evm3[config.useNetwork].contracts.xcall;
    const xcallManagerAbi = config.abi.xcallManager;
    const xcallManagerAddress =
      config.network.evm3[config.useNetwork].contracts.xcall_manager;

    const assetManagerAbi = config.abi.assetManager;
    const assetManagerAddress =
      config.network.evm3[config.useNetwork].contracts.asset_manager;
    const xcallManagerContract = getContractObjectEvm(
      xcallManagerAbi,
      xcallManagerAddress,
      EVM_SIGNER,
    );

    // get the sources for the cross chain transfer
    const responseProtocols = await xcallManagerContract["getProtocols()"]();
    const sourcesAll = JSON.parse(JSON.stringify(responseProtocols));
    const sources = sourcesAll[0];

    // instantiate the contract object
    const xcallContract = getContractObjectEvm(
      xcallAbi,
      xcallAddress,
      EVM_SIGNER,
    );

    // get fee for cross chain transfer using xcall
    const response = await xcallContract["getFee(string,bool,string[])"](
      config.network.icon[config.useNetwork].xnid,
      "0x1",
      sources,
    );
    const fee = Number(response) / 10 ** 18;
    if (Number.isNaN(fee)) {
      throw new Error("Failed to parse fee");
    }
    const receiver = `${config.network.evm1[config.useNetwork].xnid}/${EVM_SIGNER.address}`;

    // amount to trade
    const amountRaw = 1;

    const parsedAmountRaw = parseInt(amountRaw * 10 ** 6);
    const parsedFee = parseInt(fee * 10 ** 18);

    // slippage of 5%
    const slippage = 0.01;

    // fetch the current price for the USDC/bnUSD pool
    // and AVAX/bnUSD pool
    const pool1Data = await getPoolsStat("0x44");
    const pool2Data = await getPoolsStat("0x46");
    const pool1Price = parseInt(pool1Data.result.price, 16) / 10 ** 30;
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

    const assetManagerContract = getContractObjectEvm(
      assetManagerAbi,
      assetManagerAddress,
      EVM_SIGNER,
    );

    // before calling the transfer method we need to
    // approve the contract to be able to spent the
    // tokens on behalf of the user
    const tokenContractAddress =
      config.network.evm3[config.useNetwork].contracts.usdc;
    const tokenABI = [
      "function approve(address spender, uint256 amount) public returns (bool)",
    ];

    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenABI,
      EVM_SIGNER,
    );

    const approval = await tokenContract.approve(
      assetManagerAddress,
      parsedAmountRaw,
    );

    await approval.wait(1);

    console.log("Approval transaction:");
    console.log(approval);

    const hash = await depositTokenEvm(
      tokenContractAddress,
      "0x" + parsedAmountRaw.toString(16),
      routerReceiver,
      "0x" + encodedData,
      "0x" + parsedFee.toString(16),
      false,
      assetManagerContract,
      { gasPrice: 15000000, gasLimit: 10000000 },
    );

    console.log("Transaction result:");
    console.log(hash);
  } catch (err) {
    console.log("Error running the script:");
    console.error(err);
  }
}

main();
