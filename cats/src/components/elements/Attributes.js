import {util} from "../util.js";
import {Tabs, Slider, Switch } from 'antd';
import React, { useState, useEffect } from "react";


const COLOR_RANGE = { min: "10", max: "98" };
const SHAPE_RANGE_5 = { min: "1", max: "5" };
const SHAPE_RANGE_6 = { min: "1", max: "6" };

export const colorAttributes = [
  { colorName: "headColor", name: "头部和身体颜色", range: COLOR_RANGE },
  { colorName: "mouthColor", name: "嘴巴颜色", range: COLOR_RANGE },
  { colorName: "pawsColor", name: "爪子尾巴颜色", range: COLOR_RANGE },
  { colorName: "eyesColor", name: "眼睛颜色", range: COLOR_RANGE },
  { colorName: "collarColor", name: "项圈颜色", range: COLOR_RANGE },
];

export const catAttributes = [
  { colorName: "eyesShape", name: "眼神类型", range: SHAPE_RANGE_6, badge: util.getEyesBadge },
  { colorName: "foreheadShape", name: "前额类型", range: SHAPE_RANGE_5, badge: util.getShapeBadge },
  { colorName: "decorationColor", name: "前额颜色", range: COLOR_RANGE },
  { colorName: "animation", name: "动作", range: SHAPE_RANGE_6, badge: util.getAnimBadge },
  { colorName: "backgroundColor", name: "背景色", range: SHAPE_RANGE_5, badge: util.getBgBadge },
];

function ColorSelector(props){
	const dna = props.dna;
	const updateDna = props.updateDna;
	const handleColorChange = function(name,value){
		dna[name] = value;
		updateDna(dna);

	}
	return colorAttributes.map(function(attr){
		return (
			<div key={attr.colorName }>
				{attr.name} : {dna[attr.colorName]}
				<Slider name={attr.colorName} 
					min={parseInt(attr.range.min)} 
					max={parseInt(attr.range.max)} 
					defaultValue={dna[attr.colorName]} 
					onChange={(value) => handleColorChange(attr.colorName, value)}
				/>
			</div>
		)
	})
}
function AttrSelector(props){
	const dna = props.dna;
	const updateDna = props.updateDna;
	const handleAttrChange = function(name,value){
		dna[name] = value;
		updateDna(dna);
	}
	return catAttributes.map(function(attr){
		return (
			<div key={attr.colorName }>
				{attr.name} : {attr.badge?attr.badge(dna[attr.colorName]):""}
				<Slider name={attr.colorName} 
					min={parseInt(attr.range.min)} 
					max={parseInt(attr.range.max)} 
					defaultValue={dna[attr.colorName]} 
					onChange={(value) => handleAttrChange(attr.colorName, value)}
				/>
			</div>
		)
	})
}


function Attributes(props){
	const updateDna = props.updateDna;
	const dna = props.dna;
	return (<div>	
		<Tabs defaultActiveKey="1" >
			<Tabs.TabPane tab="猫颜色" key="1">
				<ColorSelector  dna={dna} updateDna={updateDna} />
			</Tabs.TabPane>
			<Tabs.TabPane tab="猫属性" key="2">
				<AttrSelector  dna={dna} updateDna={updateDna}  />
			</Tabs.TabPane>
		</Tabs>
	</div>)
}

export default Attributes;