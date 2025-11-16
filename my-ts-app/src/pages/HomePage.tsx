<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Header from '../components/header';
import Footer from '../components/footer';
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Header from "../components/header";
import Footer from "../components/footer";
>>>>>>> 90b2b4138fd6a5a00c6c0bd97caaed78c1acd058

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
<<<<<<< HEAD
    <div>
      
      <h3>
        Master your finances with our comprehensive dashboard and interactive quiz.
      </h3>
      {/* Your box */}
        <div className="container">
      <div className="box">
        <h2>Your financial life, your adventure. 
          Make choices, see the consequences, 
          and level up your money skills. </h2>
=======

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
>>>>>>> 90b2b4138fd6a5a00c6c0bd97caaed78c1acd058
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
