import React from 'react';
import { useVideoHandler } from '../hooks/useVideoHandler';
import VideoPicker from '../components/VideoPicker';
import Lottie from 'lottie-react';
import barClipLottie from '../assets/Bar-Clip-Lottie.json';
import '../styles/pages.css';
import TrimButton from '../components/TrimButton';


const VideoTrimPage: React.FC = () => {
  const {
    state: {
      video,
      isLoading,
      error,
      sasUrl,
    },
    handlers: {
      trimVideo,
      setVideo,            
    }
  } = useVideoHandler();

  const handleFileSelected = (selectedFile: File) => {
    // Check if it's a video file
    if (!selectedFile.type.startsWith('video/')) {
      console.error('❌ Invalid file type:', selectedFile.type);
      return;
    }

    // Update state with the selected file and clear any previous errors
    setVideo(selectedFile);
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="logo">BAR CLIP</div>
      </header>

      <main className="main-container">
        {!sasUrl && !isLoading && (
          <div className="page-title upload-page-title">
            <h1>BAR CLIP</h1>
            <p>
              Automated Video Trimming For Lifting Videos
            </p>
          </div>
        )}
        
        {!sasUrl && !isLoading && (
          <>
            <VideoPicker onVideoSelected={handleFileSelected} />

            <div className="upload-button-container">
              {video && (
                <TrimButton onTrim={trimVideo} isLoading={isLoading} disabled={isLoading} />
              )}
            </div>


            {error && <div className="error-message">{error}</div>}
            
            {video && (
              <div className="file-info">
                <p>Original Video File: {video.name}</p>
              </div>
            )}
          </>
        )}

        {isLoading && (
          <div className="loading-flex-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            width: '100%'
          }}>
            <div className="page-title upload-page-title" style={{ marginBottom: 8 }}>
              <h1 style={{ marginBottom: 4 }}>BAR CLIP</h1>
              <p>Trimming Video...</p>
              <p>This may take a few seconds...</p>
            </div>
            <Lottie 
              animationData={barClipLottie} 
              loop={true}
              style={{ 
                width: '90vw', 
                height: '90vw', 
                maxWidth: 500, 
                maxHeight: 500,
                marginLeft: '-50px'
              }}
            />
          </div>
        )}

        {sasUrl && (
          <div className="success-message" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            paddingTop: '0px',
            marginTop: '-80px'
          }}>
            <div className="page-title upload-page-title" style={{ marginBottom: 0 }}>
              <h1>BAR CLIP</h1>
            </div>
            <p>Trimming Complete! <a href={sasUrl} target="_blank" rel="noopener noreferrer">Download Trimmed Video</a></p>
            <div className="video-container">
              <video className="video-player" src={sasUrl} controls />
            </div>
            
          </div>
        )}
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

export default VideoTrimPage;