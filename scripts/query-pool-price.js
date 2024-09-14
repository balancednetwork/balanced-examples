const { getPoolsStat } = require("../utils/utils");

async function main() {
  try {
    const poolId = "0x47"; // Pool ID for sICX/bnUSD
    const response = await getPoolsStat(poolId);
    console.log("Response:");
    console.log(response);
  } catch (err) {
    console.log("Error running query-pool-price.js");
    console.log(err);
  }
}

main();
