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
    console.log("Request:");
    console.log(txObj2);
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

function getRlpEncodedSwapData(swapDataArray) {
  const parsedSwapData = swapDataArray.map((item) => {
    if (Array.isArray(item)) {
      return [getBytesFromNumber(item[0]), getBytesFromAddress(item[1])];
    } else {
      if (typeof item === "string") {
        return Buffer.from(item, "utf-8");
      } else if (typeof item === "number") {
        return Buffer.from(item.toString(16), "hex");
      } else {
        throw new Error(
          'Error encoding swap data: invalid type "' + item + '"',
        );
      }
    }
  });

  const rlpEncodedData = Buffer.from(getRlpEncodedMsg(parsedSwapData));
  let rlpEncodedDataStr = rlpEncodedData.toString("hex");
  rlpEncodedDataStr = rlpEncodedDataStr.replaceAll("c30181f8", "c301f800");
  return rlpEncodedDataStr;
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

function bufferToString(buffer) {
  return buffer.toString("utf8");
}

function bufferToHex(buffer) {
  return buffer.toString("hex");
}

function getNumberFromBytes(bytes) {
  return parseInt(bytes.toString("hex"), 16);
}

function getAddressFromBytes(bytes) {
  const str = bytes.toString("hex");
  return str == "f8" ? null : "cx" + str.substring(2);
}

function decodeRlpEncodedSwapData(encodedSwapData) {
  const str2 = encodedSwapData.replaceAll("c301f800", "c30181f8");
  const dataBuffer = Buffer.from(str2, "hex");
  const result = RLP.decode(dataBuffer);
  if (result.length == 0) {
    console.log("Empty");
    return;
  } else {
    const decodedAll = [];

    const encodedComponents = [];
    const encodedRoute = [];

    result.forEach((eachItem) => {
      // if the item is an array then is a path and
      // should be added to encodedRoute
      if (Array.isArray(eachItem)) {
        encodedRoute.push(eachItem);
      } else {
        encodedComponents.push(eachItem);
      }
    });
    // decoded the components
    const decodedComponents = encodedComponents.map((item) => {
      //
      if (Buffer.isBuffer(item)) {
        const a = bufferToString(item);
        const re = /[\x00-\x1F\x7F-\xFF]/.test(a) ? bufferToHex(item) : a;
        return re;
      } else if (Array.isArray(item)) {
        return item.map((subItem) => {
          return Buffer.isBuffer(subItem)
            ? /[\x00-\x1F\x7F-\xFF]/.test(bufferToString(subItem))
              ? bufferToHex(subItem)
              : bufferToString(subItem)
            : subItem;
        });
      }
    });
    decodedComponents.forEach((item) => {
      decodedAll.push(item);
    });

    // decode the route
    encodedRoute.forEach((arr) => {
      decodedAll.push([
        getNumberFromBytes(arr[0]),
        getAddressFromBytes(arr[1]),
      ]);
    });
    return decodedAll;
  }
}

module.exports = {
  getPoolsStat,
  encodePathArray,
  icxTransaction,
  getTxResult,
  decodeRlpEncodedSwapData,
  getRlpEncodedSwapData,
};
