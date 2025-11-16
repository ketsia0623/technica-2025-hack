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
            <h2 className="profile-name">Ketsia Lumiere Donfack Ouwe</h2>
            <p className="profile-role">Backend Engineer</p>
            <p className="profile-bio">
              Ketsia is so cool she made the backend systems that keep user data secure 
              and the app running smoothly.
            </p>
          </div>

          {/* Profile 2 */}
          <div className="about-card">
            <h2 className="profile-name">Samita Bomasamudram</h2>
            <p className="profile-role">Full-stack Developer</p>
            <p className="profile-bio">
              Samita builds both the client-side and server-side of the app, 
              ensuring a seamless user experience. 
            </p>
          </div>

          {/* Profile 3 */}
          <div className="about-card">
            <h2 className="profile-name">Angel Jose</h2>
            <p className="profile-role">Front-End Developer</p>
            <p className="profile-bio">
              Angel designs and implements the user interface, making sure the app is 
              intuitive and visually appealing.
            </p>
          </div>

          {/* Profile 4 */}
          <div className="about-card">
            <h2 className="profile-name">Meera Nambiar</h2>
            <p className="profile-role">Full-Stack Developer/Artist</p>
            <p className="profile-bio">
              Meera works on both the front-end and back-end, ensuring the app is functional 
              and user-friendly. She also creates the app's artwork and graphics.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
