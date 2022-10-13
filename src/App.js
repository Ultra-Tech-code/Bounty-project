import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Address from "./pages/Address";
import NFT from "./pages/NFT";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/address" element={<Address />} />
        <Route path="/nft" element={<NFT />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
