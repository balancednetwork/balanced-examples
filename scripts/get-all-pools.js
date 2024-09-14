// The following script gets all the pools in the
// Balanced Network Dex
//
const { getTokenSymbol, getNonce, getPoolsStat } = require("../utils/utils");

async function main() {
  try {
    // get amount of pools, this number is equal to getNonce - 1
    const nonce = await getNonce();
    const nonceAsDecimal = parseInt(nonce.result, 16);
    const pools = [];
    // get all pools
    for (let i = 1; i < nonceAsDecimal; i++) {
      const parsedPoolId = "0x" + i.toString(16);
      const pool = await getPoolsStat(parsedPoolId);

      if (pool == null) {
        pools.push({ id: parsedPoolId });
        continue;
      }

      const poolData = { ...pool.result, id: parsedPoolId };

      if (poolData.name == null) {
        const base = await getTokenSymbol(poolData.base_token);

        const quote = await getTokenSymbol(poolData.quote_token);
        poolData.name = `${base.result}/${quote.result}`;
      }
      pools.push(poolData);
    }

    console.log("Pools:");
    console.log(pools);
  } catch (err) {
    console.log("error running main function");
    console.log(err);
  }
}

main();
