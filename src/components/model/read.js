import {util} from "../util.js";

import {config} from "../../wagmiconf.js";
import {contractCfg} from "../../contractCfg.js";

import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount,waitForTransactionReceipt} from '@wagmi/core'

// console.log(address);

/**
 * 链上 getCat 返回的 Cat struct 字段顺序：
 *   generation, indexId, dadId, mumId, birthTime, genes
 * 其中 `genes` 是 packed DNA 大整数（10 个数字各 1~2 位，base 10 串打包）
 * RenderCat 需要的是解包后的对象 { eyesShape, foreheadShape, ... }
 * 用 util.catDna(bigint) 解包。
 */

// 把链上 getCat 返回的 Cat struct → 前端用的解包 DNA 对象
function unpackCat(catStruct) {
  if (!catStruct) return null;
  // genes 可能是 bigint / string / number，统一转 string
  const genesStr = (typeof catStruct.genes === 'bigint')
    ? catStruct.genes.toString()
    : String(catStruct.genes || '0');
  const dna = util.catDna(genesStr);
  return {
    genes: catStruct.genes,
    indexId: catStruct.indexId,
    generation: catStruct.generation,
    birthTime: catStruct.birthTime,
    dadId: catStruct.dadId,
    mumId: catStruct.mumId,
    ...dna,  // eyesShape, foreheadShape, ... 解包字段
  };
}

export const readCats = async function(){

	const { address } = getAccount(config)
	if (!address) return [];  // 未连接钱包，不调合约
	let aCats;
	try {
		aCats = await readContract(config,{
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			account:address,
			functionName: "getCatByOwn"
		});
	} catch(e) {
		console.warn('readCats getCatByOwn failed:', e.message);
		return [];
	}

    const catSellerPromise = aCats.map(async (cat) => {
      const _catId = Number(cat);  // bigint → number (tokenId 不会超过 Number.MAX_SAFE_INTEGER)
      try {
        const catStruct = await readContract(config,{
          address: contractCfg.contractCatAddress,
          abi: contractCfg.contractCatABI,
          functionName: "getCat",
          args:[_catId]
        });
        return unpackCat(catStruct);
      } catch(e) {
        console.warn('getCat(' + _catId + ') failed:', e.message);
        return null;
      }
    });

    const allCatData = (await Promise.all(catSellerPromise)).filter(x => x !== null);
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
	if (!address) return [];  // 未连接钱包，不调合约
	let aCats;
	try {
		aCats = await readContract(config,{
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			account:address,
			functionName: "getCatByOwn"
		});
	} catch(e) {
		console.warn('readNoSellCats getCatByOwn failed:', e.message);
		return [];
	}

    const catSellerPromise = aCats.map(async (cat) => {
      const _catId = Number(cat);
      try {
        const catStruct = await readContract(config,{
          address: contractCfg.contractCatAddress,
          abi: contractCfg.contractCatABI,
          functionName: "getCat",
          args:[_catId]
        });
        return unpackCat(catStruct);
      } catch(e) {
        console.warn('getCat(' + _catId + ') failed:', e.message);
        return null;
      }
    });

    const allCatData = (await Promise.all(catSellerPromise)).filter(x => x !== null);


	let aCatsOnSell;
	try {
		aCatsOnSell = await readContract(config,{
			address: contractCfg.contractMarketAddress,
			abi: contractCfg.contractMarketABI,
			functionName: "getAllTokenOnSale"
		});
	} catch(e) {
		console.warn('readNoSellCats getAllTokenOnSale failed (likely empty array viem bug):', e.message);
		aCatsOnSell = [];  // viem 2.x 在空 uint256[] 时会 throw "returned no data" 误报
	}

	var result = allCatData.filter(function(el, index){
		var _tokenId = Number(el.indexId);
		for(var i=0; i<aCatsOnSell.length;i++) {
			if(Number(aCatsOnSell[i])===_tokenId){
				return false;
			}
		}
		return true;
	});

    return result;
}


export const readMarketCats = async function(){

	const { address } = getAccount(config)
	let aCats;
	try {
		aCats = await readContract(config,{
			address: contractCfg.contractMarketAddress,
			abi: contractCfg.contractMarketABI,
			functionName: "getAllTokenOnSale"
		});
	} catch(e) {
		console.warn('readMarketCats getAllTokenOnSale failed:', e.message);
		aCats = [];
	}


    const catInfoPromise = aCats.map(async (cat) => {
      const _catId = Number(cat);
      try {
        const catStruct = await readContract(config,{
          address: contractCfg.contractCatAddress,
          abi: contractCfg.contractCatABI,
          functionName: "getCat",
          args:[_catId]
        });
        return unpackCat(catStruct);
      } catch(e) {
        console.warn('readMarketCats getCat(' + _catId + ') failed:', e.message);
        return null;
      }
    });

    const catsInfoData = (await Promise.all(catInfoPromise));

    const catSellPromise = aCats.map(async (cat) => {
      const _catId = Number(cat);
      try {
        return await readContract(config,{
          address: contractCfg.contractMarketAddress,
          abi: contractCfg.contractMarketABI,
          functionName: "getOffer",
          args:[_catId]
        });
      } catch(e) {
        console.warn('readMarketCats getOffer(' + _catId + ') failed:', e.message);
        return null;
      }
    });

    const allSellCatData = (await Promise.all(catSellPromise));

    const result = [];
    for(var i=0; i<catsInfoData.length; i++ ){
    	if (!catsInfoData[i] || !allSellCatData[i]) continue;  // skip failed reads
    	var obj = {};
    	obj.genes = catsInfoData[i].genes;
    	obj.indexId = catsInfoData[i].indexId;
    	obj.seller = allSellCatData[i][0];
    	obj.price = allSellCatData[i][1];
    	obj.marketIndex = allSellCatData[i][2];
    	// 同时把解包 DNA 带出去，渲染 cat 卡片用
    	obj.eyesShape = catsInfoData[i].eyesShape;
    	obj.foreheadShape = catsInfoData[i].foreheadShape;
    	obj.animation = catsInfoData[i].animation;
    	obj.headColor = catsInfoData[i].headColor;
    	obj.pawsColor = catsInfoData[i].pawsColor;
    	obj.decorationColor = catsInfoData[i].decorationColor;
    	obj.eyesColor = catsInfoData[i].eyesColor;
    	obj.mouthColor = catsInfoData[i].mouthColor;
    	obj.backgroundColor = catsInfoData[i].backgroundColor;
    	obj.collarColor = catsInfoData[i].collarColor;
    	if(obj.seller==address){
	    	obj.mySelfNFT = true;
	    }
	    result.push(obj)
    }
    return result;
}

export const isApprovedForAll = async function(userAddr, marketAddr){
	const args = [userAddr, marketAddr];
	try {
		let isApproved = await readContract(config,{
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			functionName: "isApprovedForAll",
			args:args
		});
		return isApproved;
	} catch(e) {
		console.warn('isApprovedForAll failed:', e.message);
		return false;  // 默认未授权，会触发 setApprovalForAll
	}
}

export const waitReceipt = async function(hash){
	const transactionReceipt = await waitForTransactionReceipt(config, {
	  hash: hash,
	});
	return transactionReceipt;
}