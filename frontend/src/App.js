import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Judiciary from "./pages/Judiciary";
import Watchtower from "./pages/Watchtower";
import LawEnforcement from "./pages/LawEnforcement";
import CommunityCorrections from "./pages/CommunityCorrections";
import BiasBeacon from "./pages/BiasBeacon";
import JurisLab from "./pages/JurisLab";
import Community from "./pages/Community";
import About from "./pages/About";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/judiciary" element={<Judiciary />} />
          <Route path="/watchtower" element={<Watchtower />} />
          <Route path="/law-enforcement" element={<LawEnforcement />} />
          <Route path="/community-corrections" element={<CommunityCorrections />} />
          <Route path="/bias-beacon" element={<BiasBeacon />} />
          <Route path="/juris-lab" element={<JurisLab />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
