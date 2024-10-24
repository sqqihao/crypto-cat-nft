import { Box, Card } from "@chakra-ui/react";
import {util} from "../util.js";
import styles from "../styles/cat.module.css";
import CatEars from "./CatParts/CatEars.js"
import {CatForehead} from "./CatParts/CatForehead.js"
import CatEyes from "./CatParts/CatEyes.js"
import CatHairs from "./CatParts/CatHairs.js"
import CatBody from "./CatParts/CatBody.js"
import RenderCatInfo from "./CatParts/RenderCatInfo.js"

import {animationStructData} from "./CatParts/animationStructData.js"


function RenderCat(props){
	const dna = props.dna;
	const updateDna = props.updateDna;
	const {
		foreheadShape,
		eyesShape,
		animation,
		headColor,
		pawsColor,
		decorationColor,
		eyesColor,
		mouthColor,
		backgroundColor,
		collarColor
	} = dna;
	const isFactory = true;
	const getBgColor = function(number){
		return util.getBgColorString(number);
	}
	const getColor = function(number){
		const color = util.getColorString(number);
		// debugger;
		return color;
	}

	return (<div>
	    <Card
	      bgImage={getBgColor(backgroundColor)}
	      borderRadius="10"
	      w={!isFactory ? "210px" : undefined}
	      h={!isFactory ? "330px" : undefined}
	      className="box-shadow">
	    	<Box className={isFactory ? styles.cat : styles.catShow} m="auto">
	    		<Box className={animation === 2 || animation === 6 ? styles.head : styles.head}>
		    		<section className={styles.head_background} style={{ backgroundColor: getColor(headColor) }} >
		    			<CatEars getColor={getColor}  headColor={headColor} pawsColor={pawsColor} />
		    			<CatForehead getColor={getColor} foreheadShape={foreheadShape} decorationColor={decorationColor} />

						<CatEyes
						getColor={getColor}
						eyesShape={eyesShape}
						eyesColor={eyesColor}
						animation={animation}
						animationStructData={animationStructData}/>

						<section className={styles.face_body} style={{ backgroundColor: getColor(mouthColor) }}>
							<div className={styles.nose} />
							<div className={styles.mouth}>
								<div className={styles.mouth_upper} />
								<div className={styles.mouth_lower_right} />
								<div className={styles.mouth_lower_left} />
							</div>

							<CatHairs />
						</section>
          			</section>
	    		</Box>
				<CatBody getColor={getColor} headColor={headColor} 
					mouthColor={mouthColor} pawsColor={pawsColor} 
					eyesColor={eyesColor} animation={animation} 
					collarColor={collarColor} animationStructData={animationStructData}>
				</CatBody>
	    	</Box>
	    	<br></br>
			<RenderCatInfo dna={dna} updateDna={updateDna}/>

	    </Card>
	</div>)
}

export default RenderCat;