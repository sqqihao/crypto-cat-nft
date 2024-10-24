import { Image } from "antd";
import banner from "../assets/images/banner.png";
import { Link } from "react-router-dom";
import { Button } from "antd";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Marketplace from './Marketplace';
import Factory from './Factory';
import Breed from './Breed';
import List from './List';

function Container(){
	const constainerStyle = {
		backgroundImage:`url(${banner})`,
		backgroundSize:"100% 80%",
		backgroundRepeat:"no-repeat",
		backgroundPosition:"top"
	};

	return (<div style={constainerStyle}>

        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/factory" element={<Factory />} />
            <Route path="/breed" element={<Breed />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </Router>

	</div>)
}
export default Container;