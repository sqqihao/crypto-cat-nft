import { Image } from "antd";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Header from "./layouts/Header";
import Home from './Home';
import Marketplace from './Marketplace';
import Factory from './Factory';
import Breed from './Breed';
import List from './List';
import Settings from './Settings';

function Container(){
	return (
		<div className="app-content">
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/marketplace" element={<Marketplace />} />
					<Route path="/factory" element={<Factory />} />
					<Route path="/breed" element={<Breed />} />
					<Route path="/list" element={<List />} />
					<Route path="/settings" element={<Settings />} />
				</Routes>
			</Router>
		</div>
	)
}
export default Container;
