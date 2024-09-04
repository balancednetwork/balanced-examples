const config = require("./config");
const RLP = require("rlp");
const axios = require("axios");
const IconService = require("icon-sdk-js");
const {
  IconWallet,
  HttpProvider,
  IconConverter,
  IconBuilder,
  SignedTransaction,
} = IconService.default;

const ENDPOINT = config.network.icon[config.useNetwork].rpc;

const ICON_PROVIDER = new HttpProvider(ENDPOINT);
const ICON_SERVICE = new IconService.default(ICON_PROVIDER);
const ICON_WALLET = IconWallet.loadPrivateKey(config.privateKey);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTxResult(txHash) {
  const maxLoops = 10;
  let loop = 0;
  while (loop < maxLoops) {
    try {
      return await ICON_SERVICE.getTransactionResult(txHash).execute();
    } catch (err) {
      void err;
      console.log(`Mining tx... (pass ${loop})`);
      loop++;
      await sleep(1000);
    }
  }
}

async function icxTransaction(
  to,
  amount,
  method = null,
  params = null,
  wallet = ICON_WALLET,
) {
  try {
    const txObj = new IconBuilder.CallTransactionBuilder()
      .from(wallet.getAddress())
      .to(to)
      .value(IconConverter.toHex(amount * 10 ** 18))
      .stepLimit(IconConverter.toHex(100000000))
      .nid(config.network.icon[config.useNetwork].nid)
      .nonce(IconConverter.toHex(1))
      .version(IconConverter.toHex(3))
      .timestamp(new Date().getTime() * 1000);

    if (params != null) {
      txObj.params(params);
    }

    if (method != null) {
      txObj.method(method);
    }

    const txObj2 = txObj.build();
    const signedTransaction = new SignedTransaction(txObj2, wallet);
    const txHash =
      await ICON_SERVICE.sendTransaction(signedTransaction).execute();
    return txHash;
  } catch (err) {
    console.log("Error sending ICX");
    console.log(err);
    throw new Error("Error sending ICX");
  }
}

async function getPoolsStat(id) {
  try {
    const data = getJsonRpcData(
      config.network.icon[config.useNetwork].contracts.dex,
      "getPoolStats",
      { _id: id },
    );
    const response = await customAxiosRequest(data);
    if (response.error) {
      throw new Error(JSON.stringify(response.error));
    }
    return response;
  } catch (err) {
    console.log("error running getPoolsStat");
    console.log(err);
  }
}

async function customAxiosRequest(data) {
  try {
    console.log("Request:");
    console.log(JSON.stringify(data));
    const response = await axios.post(ENDPOINT, data);
    return response.data;
  } catch (err) {
    console.log("error running customAxiosRequest");
    if (err.response && err.response.data) {
      return {
        error: err.response.data.error || "Unknown error",
      };
    } else {
      return {
        error: "Unknown error",
      };
    }
  }
}
function getJsonRpcData(to, method, params = null, jsonRpcMethod = "icx_call") {
  const result = {
    jsonrpc: "2.0",
    method: jsonRpcMethod,
    id: 604,
    params: {
      to: to,
      dataType: "call",
      data: { method },
    },
  };

  if (params != null) {
    result.params.data.params = params;
  }
  return result;
}

function getBytesFromNumber(value) {
  const hexString = value.toString(16).padStart(2, "0");
  return Buffer.from(
    hexString.length % 2 === 1 ? "0" + hexString : hexString,
    "hex",
  );
}

function getBytesFromAddress(address) {
  // f8 is hardcoded, it will be replaced after rlp encoded, because rlp package doesn't support encoding null.
  //  rlpEncodedDataStr = rlpEncodedDataStr.replaceAll('c30181f8', 'c301f800');

  return Buffer.from(address.replace("cx", "01") ?? "f8", "hex");
}

function getRlpEncodedMsg(msg) {
  return Array.from(RLP.encode(msg));
}

function encodePathArray(path) {
  const parsedPath = path.map((item) => {
    return [getBytesFromNumber(item[0]), getBytesFromAddress(item[1])];
  });
  const rlpEncodedData = Buffer.from(getRlpEncodedMsg(parsedPath));
  const rlpEncodedDataHex = rlpEncodedData.toString("hex");
  const customRlpEncodedDataHex = rlpEncodedDataHex.replace(
    "c30181f8",
    "c301f800",
  );
  return customRlpEncodedDataHex;
}

module.exports = {
  getPoolsStat,
  encodePathArray,
  icxTransaction,
  getTxResult,
};
