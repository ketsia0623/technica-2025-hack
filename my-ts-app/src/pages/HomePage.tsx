// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HomePage;
