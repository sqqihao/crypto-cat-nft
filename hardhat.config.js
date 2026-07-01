// 最小 hardhat.config — 只装 hardhat-ethers 拿 ethers/parseEther/getContractFactory
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20", settings: { evmVersion: "cancun", optimizer: { enabled: true, runs: 200 } } },
      { version: "0.8.24", settings: { evmVersion: "cancun", optimizer: { enabled: true, runs: 200 } } }
    ]
  },
  networks: {
    hardhat: { chainId: 31337 }
  }
};
