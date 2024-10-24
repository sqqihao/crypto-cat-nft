import React from 'react';
import { Flex, Layout, Menu , Image } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
//import logo from "public/logo.png";
import { Link } from 'react-router-dom';

const { Header , Content, Footer } = Layout;



function _Header(){
	// const items = new Array(15).fill(null).map((_, index) => ({
	//   key: index + 1,
	//   label: `nav ${index + 1}`,
	// }));
	const catLogoUri = "data:image/png;base64,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"
	const items = [
		{
			key: 'sub1',
			label: `NFT猫列表`,
			children:[
				{			
					key: 'sub1-1',
					label: 'NFT猫列表',
					onClick:()=>{
						window.location.href="./list"
					}
				},
				{
					key: 'sub1-2',
					label: "哺育NFT小猫",
					onClick:()=>{
						window.location.href="./breed"
					}
				}
			]
		},
		{
			key: 'sub2',
			label: "NFT猫市场",
			onClick:()=>{
				window.location.href="./marketplace"
			}

		},
		{
			key: 'sub3',
			label: "NFT猫工厂",
			onClick:()=>{
				window.location.href="./factory"
			}
		}
	];

	const handleClick = function(){
		window.location.href="./"
	}

	const headerStyle = {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#fff'
	};

	return (
		<div>
			<Header style={headerStyle}>
				<Image
			      width={50}
			      src={catLogoUri}
			      alt="logo Image"
			      preview="false"
				  onClick={handleClick}
			    />
				<Menu
					mode="horizontal"
					defaultSelectedKeys={['1']}
					items={items}
					style={{
						flex: 1,
						minWidth: 0,
					}}
				/>
				<ConnectButton />;
			</Header>
		</div>
	)
}

export default _Header;