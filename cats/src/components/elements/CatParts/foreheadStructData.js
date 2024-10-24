
export const foreheadStructData = function(num){

	let headObj;
	
    switch (num) {
      case 1:
      	//none
        headObj = {
		  forehead: "forehead_none",
		};
        break;
      case 2:
      	//basic
        headObj = {
		  forehead: "forehead",
		  foreheadMid: "forehead_mid",
		  foreheadLeft: "forehead_left",
		  foreheadRight: "forehead_right",
		};

        break;
      case 3:
      	//wild
        headObj = {
		  forehead: "forehead",
		  foreheadMid: "forehead_mid_wild",
		  foreheadLeft: "forehead_left_wild",
		  foreheadRight: "forehead_right_wild",
		};
        break;
      case 4:
      	//crescendo
        headObj = {
		  forehead: "forehead",
		  foreheadMid: "forehead_mid_crescendo",
		  foreheadLeft: "forehead_left_crescendo",
		  foreheadRight: "forehead_right_crescendo",
		};
        break;
      case 5:
      	//thirdEyes
        headObj = {
		  forehead: "forehead",
		  foreheadMid: "forehead_mid_thirdEyes",
		  foreheadLeft: "forehead_left_thirdEyes",
		  foreheadRight: "forehead_right_thirdEyes",
		};

       break;
       default:

        headObj = {
		  forehead: "forehead_none",
		};
	   break;
    }
    return headObj;
}
