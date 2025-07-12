import React from 'react';
import { signIn } from '../auth/AuthService';
import '../styles/pages.css';

const WelcomePage: React.FC = () => {
  return (
    <div className="page-container">
      <header className="header">
        <div className="logo">BAR CLIP</div>

      </header>

      <main className="main-container">
        <div className="page-title">
          <h1>BAR CLIP</h1>
          <p>Automated Video Trimming For Lifting Videos</p>
        </div>

        <div className="button-container">
          <button className="get-started-button" onClick={signIn}>
            Get Started
          </button> 
        </div>
      </main>
      <div className="background-animation" />
      
      <footer style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        textAlign: 'center',
        padding: '15px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <a 
          href="https://github.com/damronathan/BarClip" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            fontSize: '16px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            transition: 'all 0.2s ease',
            display: 'inline-block',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#0056b3';
            (e.target as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#007bff';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          View Source Code
        </a>
      </footer>
    </div>
  );
};

export default WelcomePage;
