import {util} from "../util.js";

import {config} from "../../wagmiconf.js";
import {contractCfg} from "../../contractCfg.js";

import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { ethers } from 'ethers';



export const breedCat = async function(_dadId,_mumId){
	let tx = await writeContract(config,{
		address: contractCfg.contractCatAddress,
		abi: contractCfg.contractCatABI,
		functionName: "Breed",
		args:[_dadId,_mumId]
	});
	// let recpt = await tx.wait();
	// console.log(recpt)
    return tx;
};


export const sellCat = async function(_price, _catId){
	const args = [ethers.parseEther(String(_price)),_catId];

	let tx = await writeContract(config,{
		address: contractCfg.contractMarketAddress,
		abi: contractCfg.contractMarketABI,
		functionName: "setOffer",
		args:args
	});

	return tx;
}

export const setApprovalForAll = async function(marketAddr, state){
	const args = [marketAddr, state]
	let tx = await writeContract(config,{
		address: contractCfg.contractCatAddress,
		abi: contractCfg.contractCatABI,
		functionName: "setApprovalForAll",
		args:args
	});

	return tx;
}

export const removeOffer = async function(_tokenId){

	const args = [_tokenId];
	let tx = await writeContract(config,{
		address: contractCfg.contractMarketAddress,
		abi: contractCfg.contractMarketABI,
		functionName: "removeOffer",
		args:args
	});
	return tx;
}

export const buyCat = async function(_tokenId,_price){
	const args = [_tokenId];
	let tx = await writeContract(config,{
		address: contractCfg.contractMarketAddress,
		abi: contractCfg.contractMarketABI,
		functionName: "buyCat",
		args:args,
		value:_price
	});
	return tx;
	
}