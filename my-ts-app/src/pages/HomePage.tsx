// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Header from '../components/header';
import Footer from '../components/footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
    <div>
      <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>
        FINANCE UNLOCKED
      </h1>

      <h3>
        Master your finances with our comprehensive dashboard and interactive quiz.
      </h3>
      {/* Your box */}
        <div className="container">
      <div className="box">
        <h2>Your financial life, your adventure. 
          Make choices, see the consequences, 
          and level up your money skills. </h2>
      </div>
    </div>


      <button onClick={() => navigate('/login')}>
        Login
      </button>
      <button
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </button>
      <button
        onClick={() => navigate('/quiz')}
      >
        Quiz
      </button>
    </div>
    <Footer />
    </div>
  );
};

export default HomePage;
