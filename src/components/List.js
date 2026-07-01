import { Card, Col, Row } from 'antd';
import React from "react";
import { util } from "./util.js";
import { readCats } from "./model/read";
import { useDataFetcher } from "../hooks/useSafeReadContract";
import { DataState } from "./DataState.js";
import RenderCat from "./elements/RenderCat.js";


function List(){
	const { data: allCatData, isLoading, isError, refetch } = useDataFetcher(
		() => readCats(),
		{ deps: [] }
	);

	return (<div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
		<b>NFT猫库存</b>
		<Row gutter={24} style={{ marginTop: 24 }}>
			<DataState
				isLoading={isLoading}
				isError={isError}
				data={allCatData}
				refetch={refetch}
				emptyText="无数据 — 还没铸造任何猫，去工厂创建吧"
				errorText="加载我的猫失败"
			>
				{(cats) => <CatList allCatData={cats}></CatList>}
			</DataState>
		</Row>
	</div>)
}

function CatList(props){
	const allCatData = props.allCatData;
	return allCatData.map(function(cat,i){
		const dna = util.catDna(cat.genes);
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
