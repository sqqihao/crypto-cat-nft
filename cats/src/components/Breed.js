import { Image } from "antd";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Flex, Card, List} from 'antd';
import { message } from "antd";

import RenderCat from "./elements/RenderCat.js";
import {util} from "./util.js";
import {readCats} from "./Model/read";
import {breedCat} from "./Model/write";

function Breed(){
	const [isModal1Open, setIsModal1Open] = useState(false);
	const [allCatData, setAllCatData] = useState([]);
	const [parentRole,setParentRole] = useState("1");
	const [dna1 ,setDna1] = useState("4020402040621461");
	const [dna2 ,setDna2] = useState("2716172298456821");
	const [parentId, setParentId] = useState([]);

	const showModal = async function(){

	    const _allCatData = await readCats();
	    setAllCatData(_allCatData);
		setIsModal1Open(true);
	}
	const handleCancel = function(){
		setIsModal1Open(false);
	}
	const onBreed = async function(){
		// Breed
		console.log(parentId)
		// debugger;
		const tx = await breedCat(parentId[0],parentId[1]);

		console.log(tx);
		message.success('哺育成功，链上哈希:'+tx);

	}
	return (<div>

		<Flex justify="center" align="center">
			<Card  style={{marginTop:"20px",scale:"70%"}}>
				<RenderCat dna={util.catDna(dna1)}/>
			</Card>
			<Button type="primary" onClick={onBreed}>哺育</Button>
			<Card style={{marginTop:"20px",scale:"70%"}}>
				<RenderCat dna={util.catDna(dna2)}/>
			</Card>
		</Flex>

		<Row gutter={24}>
			<Col span={6}></Col>
			<Col span={6}>
			</Col>
			<Col span={6}>
			</Col>
			<Col span={6}></Col>
		</Row>
		<Row gutter={24}>
			<Col span={6}></Col>
			<Col span={6}>
				<Button type="primary" onClick={()=>{setParentRole("1");showModal()}} >更改父亲</Button>
			</Col>
			<Col span={6}>
				<Button type="primary" onClick={()=>{setParentRole("0");showModal()}} >更改母亲</Button>
			</Col>
			<Col span={6}></Col>
		</Row>

		<Modal title="父母选择" open={isModal1Open}  width="70%" footer={null}  onCancel={handleCancel}>
			<Row gutter={[16, 16]}>
				<CatList allCatData={allCatData} parentRole={parentRole} setDna1={setDna1} setDna2={setDna2} handleCancel={handleCancel} parentId={parentId} setParentId={setParentId}></CatList>
			</Row>
		</Modal>
	</div>)
}

//
function CatList(props){
	const allCatData = props.allCatData;
	const setDna1 = props.setDna1;
	const setDna2 = props.setDna2;
	const parentRole = props.parentRole;
	const handleCancel = props.handleCancel;
	const parentId = props.parentId;
	const setParentId = props.setParentId;

	const handleParentSelect = function(dna){
		const dnaString = util.getDnaString(dna);
		if(parentRole=="1"){
			setDna1(dnaString)
		}else if(parentRole == "0"){
			setDna2(dnaString)
		}
		handleCancel();
	};
	const setParent = function(cat){
		if(parentRole=="1"){
			parentId[0] = cat.indexId
			setParentId(parentId)
		}else if(parentRole == "0"){
			parentId[1] = cat.indexId
			setParentId(parentId)

		}

	}

	return allCatData.map(function(cat,i){
		// console.log(cat)
		const dna = util.catDna(cat.genes);
		// const _tokenId=cat.indexId;
		//console.log(dna)
		//console.log(cat)
		return (
			<Col xs={24} lg={12} xxl={8}>
				<Card key={dna} bordered={true} style={{scale:"70%"}} dna={dna} onClick={()=>{handleParentSelect(dna);setParent(cat)}}>
					<RenderCat dna={dna} />
				</Card>
			</Col>
		)
	})
}


export default Breed;
