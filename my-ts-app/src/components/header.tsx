import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './header.css';
import Logo from "../imagess/technica-logo.png";   

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn: isLoggedInProp, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(
    isLoggedInProp ?? localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

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

        {/*  Updated Logo Section */}
        <div className="header-logo" onClick={() => navigate('/')}>
          <img src={Logo} alt="Finance Unlocked Logo" className="header-logo-img" />
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
