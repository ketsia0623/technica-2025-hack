import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>
        Financial Literacy Hub
      </h1>
      <p>
        Master your finances with our comprehensive dashboard and interactive quiz
      </p>
      <button
        onClick={() => navigate('/login')}
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;