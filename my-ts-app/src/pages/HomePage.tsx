// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const HomePage: React.FC = () => {

  return (
    <div className="login-page">
        <Header />
    <div>
      <h1 style={{ fontSize: '60px', fontWeight: 'bold', textAlign: 'center', marginTop: '50px' }}>
        FINANCE UNLOCKED
      </h1>

      <h3 style={{textAlign: 'center', marginTop: '20px', marginBottom: '40px'}}>
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
      
    </div>
    <Footer />
    </div>
  );
};

export default HomePage;
