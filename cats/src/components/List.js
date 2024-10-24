import { Image } from "antd";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { Card, Col, Row } from 'antd';
import React, { useState, useEffect } from "react";
import {util} from "./util.js";
import {readCats} from "./Model/read";

import RenderCat from "./elements/RenderCat.js";
import {NoContent} from "./templates/NoContent.js"


function List(){
	const [allCatData, setAllCatData] = useState([]);

	async function init(){

        const allCatData = await readCats();
        /*
			birthTime: 1729667493n
			dadId: 0n
			generation: 0n
			genes: 204020406214610n
			indexId: 1n
			mumId: 0n
        */
		console.log(allCatData);
		setAllCatData(allCatData);
	}

	useEffect(function(){
		init();
	},[]);

	return (<div>
		<p><br></br></p>
		<p><br></br></p>
		<b>NFT猫库存</b>
		<Row gutter={24}>
			{
				allCatData.length==0 ?
				<NoContent content="无数据"></NoContent>
				:
				<CatList allCatData={allCatData}></CatList>
			}
		</Row>
	</div>)
}

function CatList(props){
	const allCatData = props.allCatData;
	return allCatData.map(function(cat,i){
		const dna = util.catDna(cat.genes);
		console.log(dna)

		//console.log(cat)
		return (
			<Col key={cat.genes} xs="1" sm="2" md="3" lg="4">
				<Card bordered={true} style={{marginTop:"20px",scale:"90%"}}>
					<RenderCat dna={dna}/>
				</Card>
			</Col>
		)
	})
}

export default List;
