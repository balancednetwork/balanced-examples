require("dotenv").config();

const NETWORK = process.env.NETWORK || "testnet";
const PRIVATE_KEY = process.env.PRIVATE_KEY || null;

const config = {
  network: {
    icon: {
      mainnet: {
        rpc: "https://ctz.solidwallet.io/api/v3",
        nid: "0x1",
        contracts: {
          // all the balanced contracts can be found in
          // the following link
          // https://github.com/balancednetwork/balanced-java-contracts/wiki/Contract-Addresses
          dex: "cxa0af3165c08318e988cb30993b3048335b94af6c",
          router: "cx21e94c08c03daee80c25d8ee3ea22a20786ec231",
          baln: "cxf61cd5a45dc9f91c15aa65831a30a90d59a09619",
          bnusd: "cx88fd7df7ddff82f7cc735c871dc519838cb235bb",
          sicx: "cx2609b924e33ef00b648a409245c7ea394c467824",
        },
      },
      testnet: {
        rpc: "https://lisbon.net.solidwallet.io/api/v3",
        nid: "0x2",
        contracts: {
          dex: "cx7a90ed2f781876534cf1a04be34e4af026483de4",
          router: "cx2576925d931f3be8ff195914c10a87da2094c5e5",
          baln: "cxc3c552054ba6823107b56086134c2afc26ab1dfa",
          bnusd: "cx87f7f8ceaa054d46ba7343a2ecd21208e12913c6",
          sicx: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
        },
      },
    },
  },
  useNetwork: NETWORK,
  privateKey: PRIVATE_KEY,
};

module.exports = config;
