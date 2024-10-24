import {colors} from "./colors.js";

export const util = {
	getColorString : function(color){
	  return "#"+colors[color] || "#e2efff";
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
		const dnaStr = dnaBN.toString();
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
