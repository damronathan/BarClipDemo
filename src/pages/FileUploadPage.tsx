import React from 'react';
import { useFileHandler } from '../hooks/useFileHandler';
import UploadDropZone from '../components/UploadDropZone';
import Lottie from 'lottie-react';
import barClipLottie from '../assets/Bar-Clip-Lottie.json';
import '../styles/pages.css';


const FileUploadPage: React.FC = () => {
  const {
    state: {
      file,
      isLoading,
      error,
      sasUrl,
      isDragging,
    },
    handlers: {
      uploadFile,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleButtonClick,            
    }
  } = useFileHandler();

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
            <UploadDropZone className={isDragging ? 'drag-over' : ''} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onButtonClick={handleButtonClick} />

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
              <p>Please Wait While We Trim Your Video</p>
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
    </div>
  );
};

export default FileUploadPage;