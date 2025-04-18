
export const animationStructData = function(num){

	let animationObj;
	
    switch (num) {
    	//noAnim
		case 1:
			animationObj = {
				head: ""
			};
		break;
		//movingHead
		case 2:
			animationObj = {
			  head: "movingHead",
			};
		break;
		//movingTail
		case 3:
			animationObj = {
  				tail: "movingTail",
			};
		break;
		//movingPaws
		case 4:
			animationObj = {
				pawsLeft: "movingPawsLeft",
				pawsRight: "movingPawsRight",
			};
		break;
		//movingEyes
		case 5:
			animationObj = {
				eyes: "movingEyes",
				innerEyes: "movingInnerEyes",
			};
		break;
		//movingAll
		case 6:
			animationObj = {
				head: "movingHead",
				tail: "movingTail",
				pawsLeft: "movingPawsLeft",
				pawsRight: "movingPawsRight",
				eyes: "movingEyes",
				innerEyes: "movingInnerEyes",
			};
		break;
		//noAnim
		default:
			animationObj = {
				head: ""
			};
		break;
    }
    return animationObj;
}
