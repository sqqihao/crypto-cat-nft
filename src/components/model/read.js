import {util} from "../util.js";

import {config} from "../../wagmiconf.js";
import {contractCfg} from "../../contractCfg.js";

import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount,waitForTransactionReceipt} from '@wagmi/core'

// console.log(address);

export const readCats = async function(){

	const { address } = getAccount(config)
	let aCats = await readContract(config,{
		address: contractCfg.contractCatAddress,
		abi: contractCfg.contractCatABI,
		account:address,
		functionName: "getCatByOwn"
	});

    const catSellerPromise = aCats.map(async (cat) => {
      const _catId = parseInt(cat);
      // console.log(_catId);
      // const array = (await marketplaceInstance.read.getOffer?.([Number(_catId)]));
      return await readContract(config,{
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			functionName: "getCat",
			args:[_catId]
		});
    });

    const allCatData = (await Promise.all(catSellerPromise));
    /*
		birthTime: 1729667493n
		dadId: 0n
		generation: 0n
		genes: 204020406214610n
		indexId: 1n
		mumId: 0n
    */
    return allCatData;
}

export const readNoSellCats = async function(){

	const { address } = getAccount(config)
	let aCats = await readContract(config,{
		address: contractCfg.contractCatAddress,
		abi: contractCfg.contractCatABI,
		account:address,
		functionName: "getCatByOwn"
	});

    const catSellerPromise = aCats.map(async (cat) => {
      const _catId = parseInt(cat);
      // console.log(_catId);
      // const array = (await marketplaceInstance.read.getOffer?.([Number(_catId)]));
      return await readContract(config,{
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			functionName: "getCat",
			args:[_catId]
		});
    });

    const allCatData = (await Promise.all(catSellerPromise));


	let aCatsOnSell = await readContract(config,{
		address: contractCfg.contractMarketAddress,
		abi: contractCfg.contractMarketABI,
		functionName: "getAllTokenOnSale"
	});

	var result = allCatData.filter(function(el, index){
		var _tokenId = parseInt(el.indexId);
		for(var i=0; i<aCatsOnSell.length;i++) {
			if(parseInt(aCatsOnSell[i])===_tokenId){
				return false;
			}
		}
		return true;
	});

    /*
		birthTime: 1729667493n
		dadId: 0n
		generation: 0n
		genes: 204020406214610n
		indexId: 1n
		mumId: 0n
    */
    return result;
}


export const readMarketCats = async function(){

	const { address } = getAccount(config)
	let aCats = await readContract(config,{
		address: contractCfg.contractMarketAddress,
		abi: contractCfg.contractMarketABI,
		functionName: "getAllTokenOnSale"
	});


    const catInfoPromise = aCats.map(async (cat) => {
      const _catId = parseInt(cat);
      // console.log(_catId);
      // const array = (await marketplaceInstance.read.getOffer?.([Number(_catId)]));
      return await readContract(config,{
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			functionName: "getCat",
			args:[_catId]
		});
    });

    const catsInfoData = (await Promise.all(catInfoPromise));

    const catSellPromise = aCats.map(async (cat) => {
      const _catId = parseInt(cat);
      // console.log(_catId);
      // const array = (await marketplaceInstance.read.getOffer?.([Number(_catId)]));
      return await readContract(config,{
			address: contractCfg.contractMarketAddress,
			abi: contractCfg.contractMarketABI,
			functionName: "getOffer",
			args:[_catId]
		});
    });

    /*
		birthTime: 1729667493n
		dadId: 0n
		generation: 0n
		genes: 204020406214610n
		indexId: 1n
		mumId: 0n
    */
    const allSellCatData = (await Promise.all(catSellPromise));

    const result = [];
	/*
		seller
		price
		index
		tokenId
		time
	*/
    for(var i=0; i<catsInfoData.length; i++ ){
    	var obj = {};
    	obj.genes = catsInfoData[i].genes;
    	obj.indexId = catsInfoData[i].indexId;
    	obj.seller = allSellCatData[i][0];
    	obj.price = allSellCatData[i][1];
    	obj.marketIndex = allSellCatData[i][2];
    	// if(obj.seller!==address){
    	// 	result.push(obj)
    	// }
    	// debugger;
    	if(obj.seller==address){
	    	obj.mySelfNFT = true;
	    }
	    result.push(obj)
    	// debugger;
    	// result[i].seller = allSellCatData[i][0];
    }
    return result;
}

export const isApprovedForAll = async function(userAddr, marketAddr){
	const args = [userAddr, marketAddr];
	let isApproved = await readContract(config,{
		address: contractCfg.contractCatAddress,
		abi: contractCfg.contractCatABI,
		functionName: "isApprovedForAll",
		args:args
	});

    return isApproved;
}

export const waitReceipt = async function(hash){
	const transactionReceipt = await waitForTransactionReceipt(config, {
	  hash: hash,
	});
	return transactionReceipt;
}