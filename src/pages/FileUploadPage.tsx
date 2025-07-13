import React from 'react';
import { useFileHandler } from '../hooks/useFileHandler';
import VideoPicker from '../components/VideoPicker';
import Lottie from 'lottie-react';
import barClipLottie from '../assets/Bar-Clip-Lottie.json';
import '../styles/pages.css';
import { isValidVideoFile } from '../utils/fileUtils';


const FileUploadPage: React.FC = () => {
  const {
    state: {
      file,
      isLoading,
      error,
      sasUrl,
    },
    handlers: {
      uploadFile,
      setFile,            
    }
  } = useFileHandler();

  const handleFileSelected = (selectedFile: File) => {
    // Check if it's a video file
    if (!isValidVideoFile(selectedFile)) {
      console.error('❌ Invalid file type:', selectedFile.type);
      return;
    }

    // Update state with the selected file and clear any previous errors
    setFile(selectedFile);
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
            <VideoPicker onFileSelected={handleFileSelected} />

            <div className="upload-button-container">
              {file && (
                <button className="upload-button" onClick={uploadFile} disabled={isLoading}>
                  {isLoading ? 'Trimming...' : 'Trim Video'}
                </button>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {file && (
              <div className="file-info">
                <p>Original Video File: {file.name}</p>
              </div>
            )}
          </>
        )}

        {isLoading && (
          <div className="loading-flex-container">
            <div className="page-title upload-page-title loading-title">
              <h1>BAR CLIP</h1>
              <p>Trimming Video...</p>
              <p>This may take a few seconds</p>
            </div>
            <Lottie 
              animationData={barClipLottie} 
              loop={true}
              className="lottie-container"
            />
          </div>
        )}

        {sasUrl && (
          <div className="success-message success-container">
            <div className="page-title upload-page-title success-title">
              <h1>BAR CLIP</h1>
            </div>
            <p>Trimming Complete! <a href={sasUrl} download="trimmed-video.mp4" target="_blank" rel="noopener noreferrer">Download Trimmed Video</a></p>
            <div className="video-container">
              <video className="video-player" src={sasUrl} controls />
            </div>
            
          </div>
        )}
      </main>

      <div className="background-animation" />
      
      <footer className="footer">
        <a 
          href="https://github.com/damronathan/BarClip" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          View Source Code
        </a>
      </footer>
    </div>
  );
};

export default FileUploadPage;