import {util} from "../util.js";

import {config} from "../../wagmiconf.js";
import {contractCfg} from "../../contractCfg.js";

import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { ethers } from 'ethers';


// —— 通用错误处理 helper ————————————————————————

/**
 * 把 viem/wagmi 的错（User rejected / Insufficient funds / Contract revert / RPC err）
 * 翻译成对用户友好的中文短句。view 层用 message.error 显示。
 */
export function explainWriteError(e, actionLabel) {
  const msg = (e?.shortMessage || e?.message || String(e)).slice(0, 300);
  // 优先匹配常见原因
  if (/User rejected|User denied|user rejected/i.test(msg)) {
    return "已取消" + (actionLabel || "操作");
  }
  if (/insufficient funds/i.test(msg)) {
    return "ETH 余额不足，无法支付 gas";
  }
  if (/nonce.*too low/i.test(msg)) {
    return "交易 nonce 冲突，请稍后重试";
  }
  if (/gas required.*exceeds allowance/i.test(msg)) {
    return "gas 估算超限，请调高 gas limit";
  }
  if (/revert|execution reverted/i.test(msg)) {
    // 合约 revert — 抓 revert reason（viem 在 cause.data 里给）
    const cause = e.cause || e;
    const data = cause?.data || cause?.walk?.()?.data;
    if (data && data.errorName) {
      return "合约拒绝: " + data.errorName + (data.args?.length ? " " + JSON.stringify(data.args) : "");
    }
    return "合约拒绝了" + (actionLabel || "操作") + "（可能是未授权 / 状态不对）";
  }
  if (/network|fetch|timeout|ETIMEDOUT|ENOTFOUND/i.test(msg)) {
    return "网络错误，请检查 MetaMask 是否连上";
  }
  // 兜底：原始信息截短
  return (actionLabel || "操作") + "失败: " + msg;
}

// 包裹 writeContract + 错误归一化
async function safeWrite(label, params) {
  try {
    const tx = await writeContract(config, params);
    return { ok: true, tx };
  } catch (e) {
    console.warn('[' + label + '] failed:', e);
    return { ok: false, error: explainWriteError(e, label), rawError: e };
  }
}

// —— 具体 write 函数 ————————————————————————

export const breedCat = async function(_dadId, _mumId){
  return await safeWrite('哺育小猫', {
    address: contractCfg.contractCatAddress,
    abi: contractCfg.contractCatABI,
    functionName: "Breed",
    args: [_dadId, _mumId]
  });
};


export const sellCat = async function(_price, _catId){
  let priceWei;
  try {
    priceWei = ethers.parseEther(String(_price));
  } catch (e) {
    return { ok: false, error: "价格格式无效: " + _price, rawError: e };
  }
  return await safeWrite('出售挂单', {
    address: contractCfg.contractMarketAddress,
    abi: contractCfg.contractMarketABI,
    functionName: "setOffer",
    args: [priceWei, _catId]
  });
}

export const setApprovalForAll = async function(marketAddr, state){
  return await safeWrite('授权市场', {
    address: contractCfg.contractCatAddress,
    abi: contractCfg.contractCatABI,
    functionName: "setApprovalForAll",
    args: [marketAddr, state]
  });
}

export const removeOffer = async function(_tokenId){
  return await safeWrite('取消挂单', {
    address: contractCfg.contractMarketAddress,
    abi: contractCfg.contractMarketABI,
    functionName: "removeOffer",
    args: [_tokenId]
  });
}

export const buyCat = async function(_tokenId, _price){
  return await safeWrite('购买猫咪', {
    address: contractCfg.contractMarketAddress,
    abi: contractCfg.contractMarketABI,
    functionName: "buyCat",
    args: [_tokenId],
    value: _price
  });
}
