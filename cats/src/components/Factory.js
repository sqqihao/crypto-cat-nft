import { Image } from "antd";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { App } from 'antd';
import { Layout } from "antd";
import { Card } from 'antd';
import { message } from "antd";
import { Col, Divider, Row } from 'antd';
import React, { useState, useEffect } from "react";
import {util} from "./util.js";

import RenderCat from "../components/elements/RenderCat.js"
import Attributes from "../components/elements/Attributes.js"


import {config} from "../wagmiconf.js";
import {contractCfg} from "../contractCfg.js";

import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'


const defaultDna = {
    foreheadShape:2,
    eyesShape:6,
    animation:6,
    headColor:40,
    collarColor:40,
    pawsColor:40,
    decorationColor:14,
    eyesColor:20,
    mouthColor:20,
    backgroundColor:10,
  };

function Factory(){
	const cardStyle = {
		margin:"50px"
	}

	const [dna,setDna] = useState(defaultDna);

	const resetCatToDefault = function(){
		setDna(defaultDna);
	}
	const generateRandomCat = function(){
		const randomDna = {
			headColor: Math.floor(Math.random() * 89) + 10,
			mouthColor: Math.floor(Math.random() * 89) + 10,
			pawsColor: Math.floor(Math.random() * 89) + 10,
			eyesColor: Math.floor(Math.random() * 89) + 10,
			collarColor: Math.floor(Math.random() * 89) + 10,
			eyesShape: Math.floor(Math.random() * 6) + 1,
			foreheadShape: Math.floor(Math.random() * 5) + 1,
			decorationColor: Math.floor(Math.random() * 89) + 10,
			animation: Math.floor(Math.random() * 6) + 1,
			backgroundColor: Math.floor(Math.random() * 4) + 1,
		};
		setDna(randomDna);
	}
	const handleMint = async function(){
		console.log(dna)
		const dnaString = util.getDnaString(dna);
		const reqData = {
			address: contractCfg.contractCatAddress,
			abi: contractCfg.contractCatABI,
			functionName: "createCat",
			args: [dnaString]
		};
		// console.log(reqData);
		let txResult  = await writeContract(config,reqData);
		
		message.success('Mint 成功， 交易哈希:'+txResult);
		console.log(txResult);
	}
	const updateDna = function(_dna){
		console.log("---updateDna")
		console.log(_dna);
		// generateRandomCat();
		//因为dna是从内部函数传递过来的，函数运行完毕内部参数会被回收
		//setDna无法渲染，需要在该函数内新建一个对象，避免内存泄漏
		setDna(JSON.parse(JSON.stringify(_dna)));
		// setDna(dna);
	}

	useEffect(function(){
		console.log("update");
	},[dna]);

	return (<div>
		<p><br></br></p>
		<p><br></br></p>
		<b>NFT工厂</b>
		<Row>
			<Col flex={1}>
				<Card style={cardStyle}>
					<RenderCat dna={dna}></RenderCat>
				</Card>
	            <Button onClick={resetCatToDefault} className="box-shadow">
	              默认DNA
	            </Button>
	            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	            <Button  onClick={generateRandomCat} className="box-shadow">
	              随机DNA
	            </Button>
			</Col>
			<Col flex={1}>
				<Card style={cardStyle}>
			            <Attributes dna={dna} updateDna={updateDna} />
				</Card>
	            <Button onClick={handleMint} className="box-shadow">
	              新建
	            </Button>
			</Col>
		</Row>
		<p><br></br></p>
		<p><br></br></p>
		<p><br></br></p>
		<p><br></br></p>
	</div>)
}
export default Factory;
