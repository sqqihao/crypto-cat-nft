const { ethers } = require("ethers");
const {CATABI} = require("./ABI.js");
const { privateKey,myWalletAddr} = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

// const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const wallet = new ethers.Wallet(privateKey, provider);
const walletB = new ethers.Wallet(privateKey, provider);

// const signer = wallet.connect(provider);
const catAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const catContractWithWallet = new ethers.Contract(catAddr, CATABI, wallet);


async function getCat() {    

    // const txA = await catContractWithWallet.getCat("0x111");
    // console.log(await txA.wait());

    // const txB = await catContractWithWallet.getCatPerOwner("0x111");
    // console.log(await txB.wait());
    const txC = await catContractWithWallet.createCatGen0("7913203125129012");
    console.log("______________")
    console.log(txC)
    console.log("______________")
    console.log(await txC.wait());
    console.log("______________")


    const txD = await catContractWithWallet.getCatPerOwner(myWalletAddr);
    console.log("______________")
    console.log(txD)
    console.log("______________")
    // console.log(await txD.wait());
    console.log("______________")

    

    
}

getCat();