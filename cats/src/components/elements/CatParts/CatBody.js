import { Box, Card } from "@chakra-ui/react";
import styles from "../../styles/cat.module.css";

function CatBody(props){
	const getColor = props.getColor;
	const headColor= props.headColor;
	const mouthColor = props.mouthColor;
	const collarColor = props.collarColor;
	const pawsColor = props.pawsColor;
	const eyesColor = props.eyesColor;
	const animation = props.animation;
	const animationStructData = props.animationStructData(animation);
	
	return (
    <Box className={styles.catBody}>
      <section className={styles.collar} style={{ backgroundColor: getColor(collarColor) }} />
      <section className={styles.core_body} style={{ backgroundColor: getColor(headColor) }}>
        <div className={styles.inner_body} style={{ backgroundColor: getColor(mouthColor) }} />
      </section>
      <section className={styles.foot}>
        <div
          className={
            animation === 4 || animation === 6
              ? `${styles.feet_front_left} ${animationStructData.pawsLeft}`
              : styles.feet_front_left
          }
          style={{ backgroundColor: getColor(pawsColor) }}
        />
        <div
          className={
            animation === 4 || animation === 6
              ? `${styles.feet_front_right} ${animationStructData.pawsRight}`
              : styles.feet_front_right
          }
          style={{ backgroundColor: getColor(pawsColor) }}
        />
        <div
          className={
            animation === 4 || animation === 6
              ? `${styles.feet_back_left} ${animationStructData.pawsLeft}`
              : styles.feet_back_left
          }
          style={{ backgroundColor: getColor(pawsColor) }}
        />
        <div
          className={
            animation === 4 || animation === 6
              ? `${styles.feet_back_right} ${animationStructData.pawsRight}`
              : styles.feet_back_right
          }
          style={{ backgroundColor: getColor(pawsColor) }}
        />
      </section>
      <section
        className={animation === 3 || animation === 6 ? `${styles.tail} ${animationStructData.tail}` : styles.tail}
        style={{ backgroundColor: getColor(pawsColor) }}
      >
        <div className={styles.tail_ball} style={{ backgroundColor: getColor(eyesColor) }} />
      </section>
    </Box>

	);
};

export  default  CatBody;
