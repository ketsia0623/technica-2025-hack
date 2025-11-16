import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Header from "../components/header";
import Footer from "../components/footer";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />

      <div className="main-content">
        <div className="instructions-box">
          <h2>Welcome to Finance Unlocked</h2>
          <p>
            Track your spending, learn smart money habits, and explore monthly insights.
          </p>
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