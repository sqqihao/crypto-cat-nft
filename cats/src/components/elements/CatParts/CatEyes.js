import {eyesStructData} from "./eyesStructData.js";

function CatEyes(props){
	 const getColor = props.getColor;
	 const eyesShape = props.eyesShape;
	 const eyesColor = props.eyesColor;
	 const animation = props.animation;

	 const catAnimation = props.animationStructData(animation);
	 const eyes = eyesStructData(eyesShape);

	return (
    <section className={"eyes"}>
      <div className={eyes.eyesLeft}>
        <div
          className={
            eyesShape === 1 || eyesShape === 2 || (eyesShape === 5 && animation === 5) || animation === 6
              ? `${eyes.pupilsLeft} ${catAnimation.eyes}`
              : eyes.pupilsLeft
          }
          style={{ backgroundColor: getColor(eyesColor) }}
        />
        <div
          className={
            animation === 5 || animation === 6
              ? `${eyes.innerPupilsLeft} ${catAnimation.innerEyes}`
              : eyes.innerPupilsLeft
          }
        />
        <div
          className={
            animation === 5 || animation === 6
              ? `${eyes.smallerInnerPupilsLeft} ${catAnimation.innerEyes}`
              : eyes.smallerInnerPupilsLeft
          }
        />
      </div>
      <div className={eyes.eyesRight}>
        <div
          className={
            eyesShape === 1 || eyesShape === 2 || (eyesShape === 5 && animation === 5) || animation === 6
              ? `${eyes.pupilsRight} ${catAnimation.eyes}`
              : eyes.pupilsRight
          }
          style={{ backgroundColor: getColor(eyesColor) }}
        />
        <div
          className={
            animation === 5 || animation === 6
              ? `${eyes.innerPupilsRight} ${catAnimation.innerEyes}`
              : eyes.innerPupilsRight
          }
        />
        <div
          className={
            animation === 5 || animation === 6
              ? `${eyes.smallerInnerPupilsRight} ${catAnimation.innerEyes}`
              : eyes.smallerInnerPupilsRight
          }
        />
      </div>
    </section>);
}

export default CatEyes;