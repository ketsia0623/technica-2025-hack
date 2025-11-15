import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './header.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🤫</span>
          <span className="logo-text">Finance Unlocked</span>
        </div>
        <div className="header-logo" onClick={() => navigate('/homepage')}>
            <span className="home-link">Home</span>
        </div>
        <div className="header-logo" onClick={() => navigate('/dashboard')}>
            <span className="dashboard-link">Dashboard</span>
        </div>
        <div className="header-logo" onClick={() => navigate('/quiz')}>
            <span className="quiz-link">Quiz</span>
        </div>

        <nav className="header-nav">
          {isLoggedIn ? (
            <>
              <button
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}
                onClick={() => navigate('/quiz')}
              >
                Quiz
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-nav-button" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;