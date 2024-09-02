require("dotenv").config();

const NETWORK = process.env.NETWORK || "testnet";
const PRIVATE_KEY = process.env.PRIVATE_KEY || null;

const config = {
  network: {
    icon: {
      mainnet: {
        rpc: "https://ctz.solidwallet.io/api/v3",
        contracts: {
          // all the balanced contracts can be found in
          // the following link
          // https://github.com/balancednetwork/balanced-java-contracts/wiki/Contract-Addresses
          dex: "cxa0af3165c08318e988cb30993b3048335b94af6c",
        },
      },
      testnet: {
        rpc: "https://lisbon.net.solidwallet.io/api/v3",
        contracts: {
          dex: "cx7a90ed2f781876534cf1a04be34e4af026483de4",
        },
      },
    },
  },
  useNetwork: NETWORK,
  privateKey: PRIVATE_KEY,
};

module.exports = config;
