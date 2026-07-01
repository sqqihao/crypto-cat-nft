import {colors} from "./colors.js";

export const util = {
	getColorString : function(color){
	  // 越界 fallback 浅蓝（保证不抛错，颜色可能不准确但能渲染）
	  return "#" + (colors[color] || colors[1] || "e2efff");
	},
	getBgColorString :function(color) {
	  switch (color) {
	    case 1:
	      return "linear-gradient(to right, #e2efff, #e2efff)";
	    case 2:
	      return "linear-gradient(to right, #008ed4, #94bed1)";
	    case 3:
	      return "linear-gradient(to right, #5e6069, #d9dde6)";
	    case 4:
	      return "linear-gradient(to right, #e0e400, #f1edb5)";
	    case 5:
	      return "linear-gradient(to right, #1b1b1b, #444444)";
	    default:
	      return "#e2efff";
	  }
	},
	catDna:function(dnaBN){
		// 兼容两种 packed DNA 编码：
		//   A) 10 字符 packed（前端 SAMPLE_CATS 风格）— 每段 1 位
		//      顺序：[eyesShape, foreheadShape, animation, headColor, pawsColor, decorationColor, eyesColor, mouthColor, backgroundColor, collarColor]
		//   B) 16 字符 packed（链上 createCat 接收的旧格式）— 每段 1-2 位
		//      顺序：headColor(2) mouthColor(2) pawsColor(2) eyesColor(2) collarColor(2) eyesShape(1) foreheadShape(1) decorationColor(2) animation(1) backgroundColor(1)
		const dnaStr = (typeof dnaBN === 'bigint') ? dnaBN.toString() : String(dnaBN);
		if (!dnaStr || dnaStr === '0') {
			return { headColor: 1, mouthColor: 1, pawsColor: 1, eyesColor: 1, collarColor: 1, eyesShape: 1, foreheadShape: 1, decorationColor: 1, animation: 1, backgroundColor: 1 };
		}
		// A) 10 字符 packed — 每段 1 位
		if (dnaStr.length === 10) {
			return {
				eyesShape:       Number(dnaStr[0]),
				foreheadShape:   Number(dnaStr[1]),
				animation:       Number(dnaStr[2]),
				headColor:       Number(dnaStr[3]),
				pawsColor:       Number(dnaStr[4]),
				decorationColor: Number(dnaStr[5]),
				eyesColor:       Number(dnaStr[6]),
				mouthColor:      Number(dnaStr[7]),
				backgroundColor: Number(dnaStr[8]),
				collarColor:     Number(dnaStr[9]),
			};
		}
		// B) 16 字符 packed — 旧格式
		const dna = {
			//Colors
			headColor: Number(dnaStr.substring(0, 2)),
			mouthColor: Number(dnaStr.substring(2, 4)),
			pawsColor: Number(dnaStr.substring(4, 6)),
			eyesColor: Number(dnaStr.substring(6, 8)),
			collarColor: Number(dnaStr.substring(8, 10)),
			//Cattributes
			eyesShape: Number(dnaStr.substring(10, 11)),
			foreheadShape: Number(dnaStr.substring(11, 12)),
			decorationColor: Number(dnaStr.substring(12, 14)),
			animation: Number(dnaStr.substring(14, 15)),
			backgroundColor: Number(dnaStr.substring(15, 16)),
		};
		return dna;
	},
	getDnaString:function(dna){
	    const dnaString = [
	    	"headColor",
	    	"mouthColor",
	    	"pawsColor",
	    	"eyesColor",
	    	"collarColor",
	    	"eyesShape",
	    	"foreheadShape",
	    	"decorationColor",
	    	"animation",
	    	"backgroundColor"
	    ].map(function (attr,i) {
	    	// console.log(attr)
		    return dna[attr]
		}).join("");
		// console.log(dnaString)
		return dnaString;
	},
	getShapeBadge:function(number){
		switch (parseInt(number.toString())) {

			case 1:
				return "None";
			case 2:
				return "Basic";
			case 3:
				return "Wild";
			case 4:
				return "Crescendo";
			case 5:
				return "Third Eyes";
			default:
				return "Basic";
		}
	},
	getEyesBadge:function(number){

		switch (parseInt(number.toString())) {
			case 1:
				return "Basic";
			case 2:
				return "Chill";
			case 3:
				return "Tired";
			case 4:
				return "Cyclope";
			case 5:
				return "Asean";
			default:
				return "Surprised";
		}
	},
	getBgBadge:function(number){
		switch (parseInt(number.toString())) {
		case 1:
			return "Basic";
		case 2:
			return "Blue";
		case 3:
			return "Silver";
		case 4:
			return "Gold";
		case 5:
			return "Black";
		default:
			return "Basic";
		}
	},
	getAnimBadge:function(number){
		switch (parseInt(number.toString())) {
		case 1:
			return "None";
		case 2:
			return "Head";
		case 3:
			return "Tail";
		case 4:
			return "Paws";
		case 5:
			return "Eyes";
		default:
			return "All";
		}
	}
}
