import { Image } from "antd";
import { Link } from "react-router-dom";
import { Button } from "antd";
import homeCatsGroup from "../assets/images/homeCatsGroup.png";


function Home(){
	return (<div>
		<Image src={homeCatsGroup} />
		<a href="./marketplace">
		    <Button  type="primary" size="large">
		      去买NFT猫
		    </Button>
	    </a>

	</div>)
}
export default Home;