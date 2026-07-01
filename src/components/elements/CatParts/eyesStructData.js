
export const eyesStructData = function(num){
	const _shapes = {
	  1: { // basic
		eyesLeft: "eyes_left", eyesRight: "eyes_right",
		pupilsLeft: "pupils_left", pupilsRight: "pupils_right",
		innerPupilsLeft: "inner_pupils_left", innerPupilsRight: "inner_pupils_right",
		smallerInnerPupilsLeft: "smaller_inner_pupils_left", smallerInnerPupilsRight: "smaller_inner_pupils_right",
	  },
	  2: { // chill
		eyesLeft: "eyes_left_chill", eyesRight: "eyes_right_chill",
		pupilsLeft: "pupils_left_chill", pupilsRight: "pupils_right_chill",
		innerPupilsLeft: "inner_pupils_left_chill", innerPupilsRight: "inner_pupils_right_chill",
		smallerInnerPupilsLeft: "smaller_inner_pupils_left_chill", smallerInnerPupilsRight: "smaller_inner_pupils_right_chill",
	  },
	  3: { // tired
		eyesLeft: "eyes_left_tired", eyesRight: "eyes_right_tired",
		pupilsLeft: "pupils_left_tired", pupilsRight: "pupils_right_tired",
		innerPupilsLeft: "inner_pupils_left_tired", innerPupilsRight: "inner_pupils_right_tired",
		smallerInnerPupilsLeft: "smaller_inner_pupils_left_tired", smallerInnerPupilsRight: "smaller_inner_pupils_right_tired",
	  },
	  4: { // cyclope
		eyesLeft: "eyes_left_cyclope", eyesRight: "eyes_right_cyclope",
		pupilsLeft: "pupils_left_cyclope", pupilsRight: "pupils_right_cyclope",
		innerPupilsLeft: "inner_pupils_left_cyclope", innerPupilsRight: "inner_pupils_right_cyclope",
		smallerInnerPupilsLeft: "smaller_inner_pupils_left_cyclope", smallerInnerPupilsRight: "smaller_inner_pupils_right_cyclope",
	  },
	  5: { // asean
		eyesLeft: "eyes_left_asean", eyesRight: "eyes_right_asean",
		pupilsLeft: "pupils_left_asean", pupilsRight: "pupils_right_asean",
		innerPupilsLeft: "inner_pupils_left_asean", innerPupilsRight: "inner_pupils_right_asean",
		smallerInnerPupilsLeft: "smaller_inner_pupils_left_asean", smallerInnerPupilsRight: "smaller_inner_pupils_right_asean",
	  },
	  6: { // surprised
		eyesLeft: "eyes_left_surprised", eyesRight: "eyes_right_surprised",
		pupilsLeft: "pupils_left_surprised", pupilsRight: "pupils_right_surprised",
		innerPupilsLeft: "inner_pupils_left_surprised", innerPupilsRight: "inner_pupils_right_surprised",
		smallerInnerPupilsLeft: "smaller_inner_pupils_left_surprised", smallerInnerPupilsRight: "smaller_inner_pupils_right_surprised",
	  },
	};
	// 任何非法/越界/0/undefined → fallback basic（不抛错）
	return _shapes[num] || _shapes[1];
}
