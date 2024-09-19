require("dotenv").config();
const { assetManagerAbi } = require("./abi/AssetManager");
const { xcallAbi } = require("./abi/CallService");
const { xcallManagerAbi } = require("./abi/XCallManager.js");

const NETWORK = process.env.NETWORK || "testnet";
const PRIVATE_KEY = process.env.PRIVATE_KEY || null;

const config = {
  network: {
    icon: {
      mainnet: {
        rpc: "https://ctz.solidwallet.io/api/v3",
        nid: "0x1",
        xnid: "0x1.icon",
        contracts: {
          // all the balanced contracts can be found in
          // the following link
          // https://github.com/balancednetwork/balanced-java-contracts/wiki/Contract-Addresses
          dex: "cxa0af3165c08318e988cb30993b3048335b94af6c",
          router: "cx21e94c08c03daee80c25d8ee3ea22a20786ec231",
          baln: "cxf61cd5a45dc9f91c15aa65831a30a90d59a09619",
          bnusd: "cx88fd7df7ddff82f7cc735c871dc519838cb235bb",
          sicx: "cx2609b924e33ef00b648a409245c7ea394c467824",
          bnb: "cx2d552c485ec8bcaa75aac02424e2aca6ffdb2f1b",
          asset_manager: "cxabea09a8c5f3efa54d0a0370b14715e6f2270591",
          xcall_manager: "cx227f747ab644a1f453a0708a55fe6155b9e0abbb",
        },
      },
      testnet: {
        rpc: "https://lisbon.net.solidwallet.io/api/v3",
        nid: "0x2",
        xnid: "0x2.icon",
        contracts: {
          dex: "cx7a90ed2f781876534cf1a04be34e4af026483de4",
          router: "cx2576925d931f3be8ff195914c10a87da2094c5e5",
          baln: "cxc3c552054ba6823107b56086134c2afc26ab1dfa",
          bnusd: "cx87f7f8ceaa054d46ba7343a2ecd21208e12913c6",
          sicx: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
          xcall_manager: "cx5040180f7b0cd742658cb9050a289eca03083b70",
          asset_manager: "cxe9d69372f6233673a6ebe07862e12af4c2dca632",
        },
      },
    },
    evm1: {
      mainnet: {
        name: "avax",
        rpc: "https://avalanche-c-chain-rpc.publicnode.com",
        nid: "",
        xnid: "0xa86a.avax",
        contracts: {
          asset_manager: "0xdf851B4f0D9b2323e03B3980b1C4Cf56273c0bd9",
          xcall: "0xfC83a3F252090B26f92F91DFB9dC3Eb710AdAf1b",
          xcall_manager: "0xDccd213951D8214fBACa720728474E2cEf9d247B",
        },
      },
      testnet: {
        name: "fuji",
        rpc: "https://avalanche-fuji-c-chain-rpc.publicnode.com",
        nid: "",
        xnid: "0xa869.fuji",
        contracts: {
          asset_manager: "0xFD6293A1f46C379193468dD64C65CC2B1DD6A149",
          xcall: "0x28ecb198e86a7FcA1cf51032635967fc26cDDAaD",
          xcall_manager: "0xd5CECE180a52e0353654B3337c985E8d5E056344",
        },
      },
    },
    evm2: {
      mainnet: {
        name: "bsc",
        rpc: "https://bsc-dataseed.bnbchain.org/",
        nid: "",
        xnid: "0x38.bsc",
        contracts: {
          asset_manager: "0x69e81Cea7889608A63947814893ad1B86DcC03Aa",
          xcall: "0xfc83a3f252090b26f92f91dfb9dc3eb710adaf1b",
          xcall_manager: "0x8B3873e46b3923c15B7aAF1f4774585a908de226",
        },
      },
      testnet: {
        name: "bsc",
        rpc: "https://bsc-testnet-dataseed.bnbchain.org/",
        nid: "",
        xnid: "",
        contracts: {
          asset_manager: "0x82E46886e1302Ed73dB89CA8A9ea8a4a18dC8c77",
          xcall: "0xD59C71E42a1Fc070e4c2c94f0eAE0840043681D0",
          xcall_manager: "0x0d85A1B9f7982091A5C8bD56Af81fB4d2f0D50d5",
        },
      },
    },
    evm3: {
      mainnet: {
        name: "base",
        rpc: "https://mainnet.base.org/",
        nid: "",
        xnid: "0x2105.base",
        contracts: {
          asset_manager: "0xDccd213951D8214fBACa720728474E2cEf9d247B",
          xcall: "0x7fdde482956770D148E055f9d2893f84a1B6B00B",
          xcall_manager: "0xbcbd42Ab3c9d219b9c992Cc984DD2a77AfD95EF3",
          usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        },
      },
      testnet: {
        name: "",
        rpc: "",
        nid: "",
        xnid: "",
        contracts: {
          asset_manager: "",
          xcall: "",
          xcall_manager: "",
        },
      },
    },
  },
  abi: {
    assetManager: assetManagerAbi,
    xcall: xcallAbi,
    xcallManager: xcallManagerAbi,
  },
  useNetwork: NETWORK,
  privateKey: PRIVATE_KEY,
};

module.exports = config;
