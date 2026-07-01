const fs = require("fs");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", await deployer.getAddress());

  // Deploy CatContract
  const CatContract = await hre.ethers.getContractFactory("CatContract");
  const cat = await CatContract.deploy(10000);
  await cat.waitForDeployment();
  const catAddress = await cat.getAddress();
  console.log("CatContract:", catAddress);

  // Deploy CatMarketplace (无构造函数，部署后调用 setCatContract)
  const CatMarketplace = await hre.ethers.getContractFactory("CatMarketplace");
  const market = await CatMarketplace.deploy();
  await market.waitForDeployment();
  const marketAddress = await market.getAddress();
  console.log("CatMarketplace:", marketAddress);

  // Register CatContract in Marketplace
  const tx = await market.setCatContract(catAddress);
  await tx.wait();
  console.log("setCatContract tx:", tx.hash);

  // Save addresses for React frontend
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify({ catAddress, marketAddress }, null, 2)
  );
  console.log("Saved to deployed-addresses.json");

  // Mint 3 sample cats for deployer
  for (let i = 0; i < 3; i++) {
    const packed10 = [
      rand(1, 5), // eyesShape
      rand(1, 5), // foreheadShape
      rand(1, 5), // animation
      rand(1, 5), // headColor
      rand(1, 5), // pawsColor
      rand(1, 5), // decorationColor
      rand(1, 5), // eyesColor
      rand(1, 5), // mouthColor
      rand(1, 5), // backgroundColor
      rand(1, 5), // collarColor
    ].join("");
    const dna = BigInt(packed10);
    const tx = await cat.createCat(dna);
    await tx.wait();
    console.log(`Minted cat #${i} (packedDNA=${packed10}) tx=${tx.hash}`);
  }

  const totalSupply = await cat.totalSupply();
  console.log("Final totalSupply:", totalSupply.toString());
}

function rand(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
