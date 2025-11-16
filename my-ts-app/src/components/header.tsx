import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './header.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn: isLoggedInProp, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check login status from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    isLoggedInProp ?? localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    // Update login status when it changes
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    
    // Check on mount and when location changes
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    
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
                className={`nav-link ${location.pathname === '/sim' ? 'active' : ''}`}
                onClick={() => navigate('/sim')}
              >
                Simulation
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