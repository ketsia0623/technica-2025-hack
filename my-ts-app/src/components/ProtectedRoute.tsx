import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  
  // Check if user is logged in (you can enhance this with actual auth logic)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      setShowPopup(true);
      // Auto-hide popup after 3 seconds
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-icon">🔒</div>
              <h2>Access Denied</h2>
              <p>Please log in to access this page.</p>
              <div className="popup-progress"></div>
            </div>
          </div>
        )}
        <Navigate to="/login" state={{ from: location }} replace />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;