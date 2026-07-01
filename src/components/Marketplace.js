import React, { useState } from "react";
import { Input, InputNumber, Modal, Button, Row, Col, Flex, Card, List, message } from 'antd';

import RenderCat from "./elements/RenderCat.js";
import { util } from "./util.js";
import { contractCfg } from "../contractCfg.js";
import { config } from "../wagmiconf.js";
import { readCats, isApprovedForAll, waitReceipt, readMarketCats, readNoSellCats } from "./model/read";
import { breedCat, sellCat, setApprovalForAll, removeOffer, buyCat } from "./model/write";
import { useAccount } from 'wagmi'
import { readContract, writeContract, getAccount } from '@wagmi/core'
import { ethers } from 'ethers';
import { NoContent } from "./templates/NoContent.js"
import { useDataFetcher } from "../hooks/useSafeReadContract";
import { DataState } from "./DataState.js";



function Marketplace(){

	const [isModal1Open, setIsModal1Open] = useState(false);
	const [allCatData, setAllCatData] = useState([]);
	const [busy, setBusy] = useState(false);  // 出售挂单 loading
	const [buyBusyId, setBuyBusyId] = useState(null);  // 购买按钮 loading (per-cat)
	const [removeBusyId, setRemoveBusyId] = useState(null);  // 取消按钮 loading (per-cat)
	const [messageApi, messageContextHolder] = message.useMessage();

	const handleCancel = function(){
		setIsModal1Open(false);
	}

	const showModal = async function(){
	    const _allCatData = await readNoSellCats();
	    setAllCatData(_allCatData);
		setIsModal1Open(true);
	}
	const sellCatHandle = async function(price, cat){
		console.log('[sellCatHandle] cat =', JSON.stringify(cat, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2), 'price =', price);
		if (!cat) {
			messageApi.error('无效的猫数据');
			return;
		}
		if (cat.indexId === undefined || cat.indexId === null || cat.indexId === '') {
			messageApi.error('cat.indexId 缺失，请刷新"我的猫"列表');
			return;
		}
		if (!cat.genes) {
			messageApi.error('cat.genes 缺失（链上数据可能未就绪）');
			return;
		}
		setBusy(true);
		try {
			const { address } = getAccount(config);
			if (!address) {
				messageApi.error('请先连接钱包');
				return;
			}
			const isApprove = await isApprovedForAll(address, contractCfg.contractMarketAddress);
			if (!isApprove) {
				const authRes = await setApprovalForAll(contractCfg.contractMarketAddress, true);
				if (!authRes.ok) {
					messageApi.error('授权失败: ' + authRes.error);
					return;
				}
				messageApi.info('已授权市场操作您的 NFT');
			}

			const sellRes = await sellCat(price, cat.indexId);
		if (sellRes.ok) {
			messageApi.success('发布成功，链上哈希:' + sellRes.tx);
			setIsModal1Open(false);
			marketRefetch();
		} else {
				messageApi.error('发布失败: ' + sellRes.error);
			}
		} finally {
			setBusy(false);
		}
	}

	const removeOfferHandle = async function(_id){
		setRemoveBusyId(_id);
		try {
			const res = await removeOffer(_id);
			if (res.ok) {
				messageApi.success('删除成功，链上哈希:' + res.tx);
				marketRefetch();
			} else {
				messageApi.error('删除失败: ' + res.error);
			}
		} finally {
			setRemoveBusyId(null);
		}
	}
	const buyCatHandle = async function(_id, _price){
		setBuyBusyId(_id);
		try {
			const res = await buyCat(_id, _price);
			if (res.ok) {
				messageApi.success('购买成功，链上哈希:' + res.tx);
				marketRefetch();
			} else {
				messageApi.error('购买失败: ' + res.error);
			}
		} finally {
			setBuyBusyId(null);
		}
	}
	// 链上数据：挂单列表
	const { data: allMarketCatData, isLoading: marketLoading, isError: marketError, refetch: marketRefetch } = useDataFetcher(
		() => readMarketCats(),
		{ deps: [] }
	);

	return (<div>
		{messageContextHolder}
		<p><br></br></p>
		<div style={{ textAlign: 'center', marginBottom: 24 }}>
			<Button type="primary" onClick={showModal} size="large" style={{
				background: 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)',
				border: 'none',
				boxShadow: '0 4px 16px rgba(255, 77, 141, 0.3)',
				padding: '0 32px',
				height: 44,
				fontSize: 15,
				fontWeight: 600,
			}}>出售</Button>
		</div>
		<Row gutter={24}>
			<DataState
				isLoading={marketLoading}
				isError={marketError}
				data={allMarketCatData}
				refetch={marketRefetch}
				emptyText="市场暂无挂单 — 你的猫可以挂上来卖"
				errorText="加载市场失败"
			>
				{(cats) => <CatMarketList allCatData={cats} removeOfferHandle={removeOfferHandle} buyCatHandle={buyCatHandle} removeBusyId={removeBusyId} buyBusyId={buyBusyId}></CatMarketList>}
			</DataState>
		</Row>
		<Modal title="出售NFT" open={isModal1Open}  width="70%" footer={null}  onCancel={handleCancel} confirmLoading={busy}>
			<Row gutter={[16, 16]}>
				<ModalCatList allCatData={allCatData} handleCancel={handleCancel} sellCatHandle={sellCatHandle} busy={busy}></ModalCatList>
			</Row>
		</Modal>
	</div>)
}

//

function CatMarketList(props){
	const allCatData = props.allCatData;
	const removeOfferHandle = props.removeOfferHandle;
	const buyCatHandle = props.buyCatHandle;
	const removeBusyId = props.removeBusyId;
	const buyBusyId = props.buyBusyId;
	return allCatData.map(function(cat,i){
		const dna = util.catDna(cat.genes);
		const _priceWei = cat.price;
		const price = ethers.formatEther(String(cat.price));
		const _tokenId = cat.indexId;
		const mySelfNFT = cat.mySelfNFT;
		return (
			<Col key={cat.genes} xs="1" sm="2" md="3" lg="4">
				<Card bordered={true} style={{marginTop:"20px",scale:"90%"}}>
					<RenderCat dna={dna}/>
				</Card>
				{price}ETH
				&nbsp;&nbsp;
				{mySelfNFT?
					<Button color="primary" variant="solid" loading={removeBusyId === _tokenId} onClick={()=>{ removeOfferHandle(_tokenId) }}>取消出售</Button>
					:
					<Button color="primary" variant="dashed" loading={buyBusyId === _tokenId} onClick={()=>{ buyCatHandle(_tokenId,_priceWei) }}>购买</Button>
				}

			</Col>
		)
	})
}
//
function ModalCatList(props){
	const allCatData = props.allCatData;
	const sellCatHandle = props.sellCatHandle;
	const busy = props.busy;
	const [prices, setPrices] = useState({});  // {tokenId: price}
	const [errors, setErrors] = useState({});  // {tokenId: 'error msg'}

	// 价格校验：必须 > 0 且 < 1000
	const validatePrice = (value) => {
		if (value === null || value === undefined || value === '') return '请输入价格';
		const n = Number(value);
		if (isNaN(n) || n <= 0) return '价格必须大于 0';
		if (n >= 1000) return '价格不能超过 1000 ETH';
		return null;
	};

	return allCatData.map(function(cat, i){
		const dna = util.catDna(cat.genes);
		const tokenId = String(cat.indexId);
		const defaultPrice = 0.1;
		const currentPrice = prices[tokenId] !== undefined ? prices[tokenId] : defaultPrice;
		const err = validatePrice(currentPrice);
		return (
			<Col key={cat.indexId} xs={24} lg={12} xxl={8}>
				<Card dna={dna} bordered={true} style={{scale:"70%"}} >
					<RenderCat dna={dna} />
					<br />
					<InputNumber
						step={0.1}
						min={0.001}
						max={999}
						value={currentPrice}
						status={err ? 'error' : ''}
						onChange={(value) => {
							setPrices({...prices, [tokenId]: value});
							setErrors({...errors, [tokenId]: validatePrice(value)});
						}}
						addonAfter="ETH"
						disabled={busy}
						style={{ width: '100%' }}
					/>
					{err && <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>{err}</div>}
					<Button
						color="primary"
						variant="dashed"
						dna={dna}
						cat={cat}
						loading={busy}
						disabled={busy || !!err}
						onClick={() => { sellCatHandle(Number(currentPrice) || defaultPrice, cat) }}
					>出售</Button>
				</Card>
			</Col>
		)
	})
}

export default Marketplace;