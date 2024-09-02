const config = require("./config");
const axios = require("axios");

const ENDPOINT = config.network.icon[config.useNetwork].rpc;
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

module.exports = {
  getPoolsStat,
};
