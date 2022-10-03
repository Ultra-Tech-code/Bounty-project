import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Fragment } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Address from "./pages/Address";
import NFT from "./pages/NFT";

// https://svc.blockdaemon.com/universal/v1/{protocol}/{network}/account/{address}

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
