import { useMemo, useState } from "react";

import { getContract, parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import useNotify from "./useNotify";
import useReadContract from "./useReadContract";
import useTransactionReceipt from "./useTransactionReceipt";
import { ExplorerLink } from "../components/elements/ExplorerLink";
import { contracts } from "../data/contracts";
import { logError } from "../utils/errorUtil";

const useWriteContract = () => {
  const { address } = useAccount();
  const client = useWalletClient()?.data;
  const { getUserCats, getCatsWithoutOffer, getCatsOffersForMarket } = useReadContract();
  const { awaitTransactionReceipt } = useTransactionReceipt();
  const notify = useNotify();
  const [loading, setLoading] = useState<boolean>(false);

  const catInstance = useMemo(
    () => (client ? getContract({ address: contracts.cat.address, abi: contracts.cat.abi, client }) : null),
    [client]
  );
  const marketplaceInstance = useMemo(
    () =>
      client ? getContract({ address: contracts.marketplace.address, abi: contracts.marketplace.abi, client }) : null,
    [client]
  );

  /* Set Token Allowance:
   *************************/
  const approveNft = async (): Promise<void> => {
    if (!catInstance?.write.setApprovalForAll) return;

    setLoading(true);
    try {
      const hash: `0x${string}` = await catInstance.write.setApprovalForAll([contracts.marketplace.address, true]);
      await awaitTransactionReceipt({ hash });
      notify({
        title: "NFT 授权设置",
        message: "设置成功",
        status: "success",
      });
    } catch (error: unknown) {
      notify({
        title: "NFT 授权禁止",
        message: "设置失败",
        status: "error",
      });
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  /* Mint a gen0 cat from the factory :
   *************************************/
  const mintCat = async (dna: string): Promise<void> => {
    if (!catInstance?.write.createCatGen0) return;

    setLoading(true);
    try {
      const hash: `0x${string}` = await catInstance.write.createCatGen0([dna]);

      await awaitTransactionReceipt({ hash });
      const msg = (
        <>
          <ExplorerLink hash={hash} />
        </>
      );
      notify({
        title: "Mint 成功",
        message: msg,
        status: "success",
      });
      if (address) getUserCats(address);
    } catch (error: unknown) {
      const msg = logError(error);
      notify({
        title: "一个错误发生",
        message: msg ?? ".",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Breed a new cat from 2 parents :
   ***********************************/
  const breedCat = async (id1: number, id2: number): Promise<void> => {
    if (!catInstance?.write.breed) return;

    setLoading(true);
    try {
      const hash: `0x${string}` = await catInstance.write.breed([id1, id2]);
      await awaitTransactionReceipt({ hash });
      const msg = (
        <>
          <ExplorerLink hash={hash} />
        </>
      );
      notify({
        title: "哺育成功",
        message: msg,
        status: "success",
      });
    } catch (error: unknown) {
      const msg = logError(error);
      notify({
        title: "一个错误发生",
        message: msg ?? ".",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Add a cat offer to the marketplace :
   *****************************************/
  const sellCat = async (price: bigint, id: number): Promise<void> => {
    if (!marketplaceInstance?.write.setOffer) return;

    setLoading(true);
    try {
      const hash: `0x${string}` = await marketplaceInstance.write.setOffer([price, id]);
      await awaitTransactionReceipt({ hash });
      const msg = (
        <><ExplorerLink hash={hash} />
        </>
      );
      notify({
        title: "发布成功",
        message: msg,
        status: "success",
      });
      getCatsWithoutOffer();
    } catch (error: unknown) {
      const msg = logError(error);
      notify({
        title: "一个错误发生",
        message: msg ?? ".",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Remove a cat offer from the marketplace :
   *********************************************/
  const cancelOffer = async (id: number): Promise<void> => {
    if (!marketplaceInstance?.write.removeOffer) return;

    setLoading(true);
    try {
      const hash: `0x${string}` = await marketplaceInstance.write.removeOffer([id]);
      await awaitTransactionReceipt({ hash });
      const msg = (
        <>
          id为{id}已被取消
          <ExplorerLink hash={hash} />
        </>
      );
      notify({
        title: "发布取消成功",
        message: msg,
        status: "success",
      });
      if (address) getCatsOffersForMarket(address);
    } catch (error: unknown) {
      const msg = logError(error);
      notify({
        title: "一个错误发生",
        message: msg ?? ".",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Remove a cat offer from the marketplace :
   *********************************************/
  const buyOffer = async (id: number, price: number): Promise<void> => {
    if (!marketplaceInstance?.write.buyCat) return;

    setLoading(true);
    try {
      const hash: `0x${string}` = await marketplaceInstance.write.buyCat([id], {
        value: parseEther(price.toString()),
      });
      await awaitTransactionReceipt({ hash });
      const msg = (
        <>
          成功购买id为{id}的NFT猫
          <ExplorerLink hash={hash} />
        </>
      );
      notify({
        title: "购买成功",
        message: msg,
        status: "success",
      });
      if (address) getCatsOffersForMarket(address);
    } catch (error: unknown) {
      const msg = logError(error);
      notify({
        title: "一个错误发生",
        message: msg ?? ".",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { approveNft, mintCat, breedCat, sellCat, cancelOffer, buyOffer, loading };
};

export default useWriteContract;
