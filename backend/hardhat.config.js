require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */const privateKey = process.env.PRIVATE_KEY;

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      // optimizer: {
      //   enabled: true,
      //   runs: 9999,
      // },
    },
  },
  networks: {
    main: {
      url: `${process.env.PRC_URL_ETH}`,
      accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 1,
    },
    sepolia: {
      url: `${process.env.PRC_URL_SEPOLIA}`,
      accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 11155111,
    },
    // Polygon networks
    polygon: {
      url: `${process.env.PRC_URL_POLYGON}`,
      accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 137,
    },
    mumbai: {
      url: `${process.env.PRC_URL_POLYGON_MUMBAI}`,
      accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 80001,
    },
    local: {
      url: `${process.env.PRC_URL_LOCAL}`,
      accounts: ["ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      chainId: 1337,
    },
    hardhat: {
      chainId: 1337, // 自定义 Chain ID, 你可以设置为其他合法的数字
    },
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
  },
  // contractSizer: {
  //   runOnCompile: true,
  //   strict: true,
  // },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // docgen: {
  //   path: "./docs",
  //   clear: true,
  //   runOnCompile: true,
  // },
};

module.exports = config;