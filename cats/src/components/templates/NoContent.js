import { Flex } from "antd";
import { Empty ,Button} from "antd";


export const NoContent = function(props){
	let content = props.content;

	const boxStyle = {
		width: '100%',
		height: 120,
	};
	return (
			<Flex style={boxStyle} justify="center" align="center">

				<Empty />

			</Flex>
		)
};