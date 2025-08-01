import React, { useRef, useState } from "react";
import styled from 'styled-components';
import * as AuthService from "../auth/AuthService";

interface VideoPickerProps {
  className?: string;
  onVideoSelected: (videoFile: File) => void;
  accept?: string;
}

const VideoPicker: React.FC<VideoPickerProps> = ({
  className,
  onVideoSelected,
  accept = "video/*",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    const account = AuthService.msalInstance.getActiveAccount();
    if (!account) {
      setError('User not logged in. Redirecting to sign in...');
      setTimeout(() => {
        AuthService.signIn();
      }, 2000);
      return;
    }

    setError(null); // Clear any previous errors
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoFile = e.target.files?.[0];
    if (videoFile) {
      onVideoSelected(videoFile);
    }
    e.target.value = ""; // reset input so the same file can be picked again
  };

  return (
    <div className={className} style={{ textAlign: 'center' }}>
      <UploadButton onClick={handleButtonClick}>
        Choose Video
      </UploadButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

const UploadButton = styled.button`
  background: #2563eb;
  color: white;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

export default VideoPicker;
