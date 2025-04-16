import './App.css';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Marketplace />}/>
          <Route path="/nftpage/:tokenId" element={<NFTPage />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/sellNFT" element={<SellNFT />}/>
          <Route path="*" element={<div className="text-center mt-10 text-white">404: Page Not Found</div>}/>
        </Routes>
    </div>
  );
}

export default App;