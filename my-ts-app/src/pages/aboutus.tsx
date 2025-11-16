import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import './aboutus.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Header />

      <div className="about-container">
        <h1 className="about-title">Meet the Team</h1>
        <p className="about-subtitle">
          The minds behind Finance Unlocked — designing tools to help you master your money.
        </p>

        <div className="about-grid">
          {/* Profile 1 */}
          <div className="about-card">
            <h2 className="profile-name">Ava Thompson</h2>
            <p className="profile-role">Lead Financial Educator</p>
            <p className="profile-bio">
              Ava specializes in simplifying personal finance for beginners. 
              She designs learning paths and quizzes used across the platform.
            </p>
          </div>

          {/* Profile 2 */}
          <div className="about-card">
            <h2 className="profile-name">Jordan Reyes</h2>
            <p className="profile-role">Front-End Developer</p>
            <p className="profile-bio">
              Jordan focuses on UI/UX, ensuring every experience feels clean, accessible, 
              and empowering — from dashboards to interactive tools.
            </p>
          </div>

          {/* Profile 3 */}
          <div className="about-card">
            <h2 className="profile-name">Mya Patel</h2>
            <p className="profile-role">Data & Insights Lead</p>
            <p className="profile-bio">
              Mya builds the logic behind quizzes, scoring, and personalized financial insights.
            </p>
          </div>

          {/* Profile 4 */}
          <div className="about-card">
            <h2 className="profile-name">Ethan Kim</h2>
            <p className="profile-role">Backend Engineer</p>
            <p className="profile-bio">
              Ethan maintains secure API systems, user authentication, and database tools 
              powering the app.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
