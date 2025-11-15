import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">Finance Unlocked</h3>
          <p className="footer-text">
            Finances and finances and finances and you'll never guess what comes next: finances!
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subheading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/quiz">Quiz</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subheading">Resources</h4>
          <ul className="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subheading">Connect</h4>
          <div className="social-links">
            <ul className="footer-links">
            <li><a href="#linkedin">LinkedIn</a></li>
            <li><a href="#instagram">Instagram</a></li>
            <li><a href="#facebook">Facebook</a></li>
          </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} FinLit Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;