import { Image } from "antd";
import { Link } from "react-router-dom";
import React, { useState, useEffect ,useRef} from "react";
import { Input, InputNumber, Modal, Button, Row, Col, Flex, Card, List} from 'antd';
import { message } from "antd";

import RenderCat from "./elements/RenderCat.js";
import {util} from "./util.js";

import {contractCfg} from "../contractCfg.js";
import {config} from "../wagmiconf.js";

import {readCats,isApprovedForAll,waitReceipt,readMarketCats,readNoSellCats} from "./Model/read";
import {breedCat,sellCat,setApprovalForAll,removeOffer,buyCat} from "./Model/write";

import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { ethers } from 'ethers';
import {NoContent} from "./templates/NoContent.js"



function Marketplace(){

	const [isModal1Open, setIsModal1Open] = useState(false);
	const [allCatData, setAllCatData] = useState([]);
	const [allMarketCatData, setAllMarketCatData] = useState([]);

	const handleCancel = function(){
		setIsModal1Open(false);
	}

	const showModal = async function(){
	    const _allCatData = await readNoSellCats();
	    setAllCatData(_allCatData);
		setIsModal1Open(true);
	}
	const sellCatHandle = async function(price, cat){
		const { address } = getAccount(config)
		console.log(address);
		const isApprove = await isApprovedForAll(address,contractCfg.contractMarketAddress)
		if(!isApprove){
			let hash = await setApprovalForAll(contractCfg.contractMarketAddress,true);
			const transactionReceipt = await waitReceipt(hash)
			// debugger;
		}
		// debugger;

		let tx = await sellCat(price,cat.indexId);
		console.log(tx)
		message.success('发布成功，链上哈希:'+tx);

		setIsModal1Open(false);
		marketInit();
	}

	const removeOfferHandle = async function(_id){
		let tx = await removeOffer(_id);
		console.log(tx)
		message.success('删除成功，链上哈希:'+tx);
		marketInit();
	}
	const buyCatHandle = async function(_id,_price){
		let tx = await buyCat(_id,_price);
		console.log(tx)
		message.success('购买成功，链上哈希:'+tx);
		marketInit();
	}
	async function marketInit(){
		const allMaketCatData = await readMarketCats();
		console.log(allMaketCatData);
		// debugger;
		setAllMarketCatData(allMaketCatData);
	}
	useEffect(function(){
		marketInit();
	},[]);

	return (<div>
		<p><br></br></p>
		<Button type="primary" onClick={showModal} >出售</Button>
		<p><br></br></p>
		<Row gutter={24}>
			{
				allMarketCatData.length==0 ?
				<NoContent content="无数据"></NoContent>
				:
				<CatMarketList allCatData={allMarketCatData} removeOfferHandle={removeOfferHandle} buyCatHandle={buyCatHandle}></CatMarketList>
			}
		</Row>
		<Modal title="出售NFT" open={isModal1Open}  width="70%" footer={null}  onCancel={handleCancel}>
			<Row gutter={[16, 16]}>
				<ModalCatList allCatData={allCatData} handleCancel={handleCancel} sellCatHandle={sellCatHandle}></ModalCatList>
			</Row>
		</Modal>
	</div>)
}

//

function CatMarketList(props){
	const allCatData = props.allCatData;
	const removeOfferHandle = props.removeOfferHandle;
	const buyCatHandle = props.buyCatHandle;
	return allCatData.map(function(cat,i){
		const dna = util.catDna(cat.genes);
		const _priceWei = cat.price;
		// debugger;
		const price = ethers.formatEther(String(cat.price));//parseInt(cat.price);
		const _tokenId = cat.indexId;
		// ethers.formatEther(String(cat.price)
		// console.log(dna)
		const mySelfNFT = cat.mySelfNFT;

		console.log(mySelfNFT);
		//console.log(cat)
		return (
			<Col key={cat.genes} xs="1" sm="2" md="3" lg="4">
				<Card bordered={true} style={{marginTop:"20px",scale:"90%"}}>
					<RenderCat dna={dna}/>
				</Card>
					{price}ETH
					&nbsp;&nbsp;
					{mySelfNFT?
						<Button  color="primary" variant="solid" onClick={()=>{  removeOfferHandle(_tokenId) }}>取消出售</Button>
						:
						<Button  color="primary" variant="dashed" onClick={()=>{ buyCatHandle(_tokenId,_priceWei) }}>购买</Button>
					}
					
			</Col>
		)
	})
}
//
function ModalCatList(props){
	const allCatData = props.allCatData;
	const sellCatHandle = props.sellCatHandle;

	return allCatData.map(function(cat,i){
		// console.log(cat)
		const dna = util.catDna(cat.genes);
		//局部变量
		let _price = 0.1; // 初始化NFT价格
		//const _tokenId=cat.indexId;
		//console.log(dna)
		//console.log(cat)
		return (
			<Col key={cat.indexId} xs={24} lg={12} xxl={8}>
				<Card dna={dna} bordered={true} style={{scale:"70%"}} >
					<RenderCat dna={dna} />
					<br />
					<InputNumber step={0.1}  min={0.1} max={100} defaultValue={_price} onChange={(value)=>(_price = value)} addonAfter="ETH" />
					<Button  color="primary" variant="dashed" dna={dna} cat={cat} onClick={()=>{sellCatHandle(_price,cat)}}>出售</Button>
				</Card>
			</Col>
		)
	})
}

export default Marketplace;