// 不依赖 hardhat ethers plugin，直接用 ethers
const { ethers } = require("ethers");

const PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // hardhat account 0
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(PK, provider);

const MKT_ADDR = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";
const mkt = new ethers.Contract(MKT_ADDR, [
  "function setOffer(uint256 _price, uint256 _tokenId) external",
  "function getAllTokenOnSale() external view returns (uint256[] memory)"
], wallet);

(async () => {
  console.log("Listing token 0 for 0.05 ETH");
  const tx = await mkt.setOffer(ethers.parseEther("0.05"), 0);
  const r = await tx.wait();
  console.log("Listed. Tx:", tx.hash);
  const all = await mkt.getAllTokenOnSale();
  console.log("On sale:", all.map(x => x.toString()));
})().catch(e => { console.error(e); process.exit(1); });
