import styles from "../../styles/cat.module.css";
import {util} from "../../util.js";

function CatEars(props){
	const headColor = props.headColor;
	const pawsColor = props.pawsColor;

	const getColor = props.getColor;
	return (
		<section className={styles.ears}>
			<div className={styles.ear_left} style={{ backgroundColor: getColor(headColor) }}>
				<div className={styles.inner_ear_left} style={{ backgroundColor: getColor(pawsColor) }} />
			</div>
			<div className={styles.ear_right} style={{ backgroundColor: getColor(headColor) }}>
				<div className={styles.inner_ear_right} style={{ backgroundColor: getColor(pawsColor) }} />
			</div>
		</section>
	)
}
export default CatEars