// require hre, { ethers } from "hardhat";
const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

// const { ethers } = require("ethers");

async function main() {

  const [wallet1] = await ethers.getSigners();
  console.log("wallet1 addr:" + wallet1.address);


  const Cat = await ethers.getContractFactory("CatContract",wallet1);
  const catContract = await Cat.deploy(10000);
  await catContract.waitForDeployment();
  const catContractAddress = await catContract.getAddress();
  console.log("CatContract contract address: "+catContractAddress);


  const Market = await ethers.getContractFactory("CatMarketplace",wallet1);
  const marketContract = await Market.deploy();
  await marketContract.waitForDeployment();
  const marketContractAddress = await marketContract.getAddress();
  marketContract.setCatContract(catContractAddress)
  console.log("marketContractAddress contract address: "+marketContractAddress);


  // console.log(contract.interface.format('json'))
  let data = {
    address: catContractAddress,
    abi: catContract.interface.format('json')
  }
  fs.writeFileSync('./CatContract.json', JSON.stringify(data))


  // console.log(contract.interface.format('json'))
  data = {
    address: marketContractAddress,
    abi: marketContract.interface.format('json')
  }
  fs.writeFileSync('./CatMarketplace.json', JSON.stringify(data))


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});