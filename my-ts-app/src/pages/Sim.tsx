import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sim.css";
import Images from "./images";
import Header from "../components/header";
import Footer from "../components/footer";  

const Sim: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="simmer-page">
      <Header />
    <div className="sim-page">
      <strong style={{ fontSize: "100px", display: "block" }}>Simulation</strong>
      <header style={{ fontSize: "50px", marginBottom: "40px" }}>
        Choose your character:
      </header>

      {/* Character images */}
      <div className="sim-container">
      <Images onClick={() => navigate("/quiz")} />
    
    </div>

    
    </div>
    <Footer />

    </div>
  );
};

export default Sim;
