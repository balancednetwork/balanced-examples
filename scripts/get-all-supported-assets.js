const { getAssets, getTokenSymbol } = require("../utils/utils");

async function main() {
  try {
    const iconxnid = "0x1.icon";
    const onChainAssetsResponse = await getAssets();
    const onChainAssets = onChainAssetsResponse.result;
    console.log("Response:");
    console.log(onChainAssets);

    const allAssets = {
      [iconxnid]: {},
    };
    const onChainAssetsKeys = Object.keys(onChainAssets);
    for (let i = 0; i < onChainAssetsKeys.length; i++) {
      const asset = onChainAssets[onChainAssetsKeys[i]];
      if (asset.startsWith("cx")) {
        const tokenSymbol = await getTokenSymbol(asset);
        allAssets[iconxnid][tokenSymbol.result] = asset;
      }
    }

    for (let i = 0; i < onChainAssetsKeys.length; i++) {
      const offChainAddress = onChainAssetsKeys[i];
      const [offChainNid, offChainContract] = offChainAddress.split("/");
      const contract = onChainAssets[offChainAddress];

      if (allAssets[offChainNid] === undefined) {
        allAssets[offChainNid] = {};
      }

      const assetsLabels = Object.keys(allAssets[iconxnid]);
      for (let j = 0; j < assetsLabels.length; j++) {
        if (allAssets[iconxnid][assetsLabels[j]] === contract) {
          allAssets[offChainNid][assetsLabels[j]] = offChainContract;
        }
      }
    }
    console.log("All supported assets:");
    console.log(allAssets);
  } catch (err) {
    console.log("Error running get-all-supported-assets.js");
    console.log(err);
  }
}

main();
