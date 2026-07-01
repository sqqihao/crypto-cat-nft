import { Box, Card } from "@chakra-ui/react";
import styles from "../../styles/cat.module.css";
import {util} from "../../util.js";

function RenderCatInfo(props){
	const dna = props.dna;
    const dnaString = util.getDnaString(dna);
    return (
	    <Box className={styles.dnaDiv}>
		    <Box className={styles.dnaPill}>
		      DNA:{dnaString}
		    </Box>
	    </Box>
    );
}

export default RenderCatInfo;
