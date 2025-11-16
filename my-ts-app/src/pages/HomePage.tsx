import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Logo from "../imagess/technica-logo.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />

      <div className="main-content">

        {/* Logo Display */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="instructions-box">
          <h2>Welcome to Finance Unlocked</h2>
          <h3>
            The key to your financial future.
          </h3>
        </div>

        <div className="home-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/quiz")}>Quiz</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
