import { Box, Card } from "@chakra-ui/react";
import styles from "../../styles/cat.module.css";
import {util} from "../../util.js";

function RenderCatInfo(props){
	const dna = props.dna;
    const dnaString = util.getDnaString(dna);
	return (
	    <Box className={styles.dnaDiv}>
		    <Box  w="fit-content" m="auto" p={"1px 5px"} borderRadius={3}>
		      DNA:{dnaString}
		    </Box>
	    </Box>
    );
}

export default RenderCatInfo;