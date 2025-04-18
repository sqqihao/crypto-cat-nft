import styles from "../../styles/cat.module.css";

function CatHairs(){
	return (
	  <div className={styles.hairs}>
	    <div className={styles.hair_left_top} />
	    <div className={styles.hair_left_mid} />
	    <div className={styles.hair_left_bottom} />
	    <div className={styles.hair_right_top} />
	    <div className={styles.hair_right_mid} />
	    <div className={styles.hair_right_bottom} />
	  </div>
	);
};

export  default  CatHairs;