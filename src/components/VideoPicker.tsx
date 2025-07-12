import React, { useRef } from "react";
import styled from 'styled-components';

interface FilePickerProps {
  className?: string;
  onFileSelected: (file: File) => void;
  accept?: string;
}

const FilePicker: React.FC<FilePickerProps> = ({
  className,
  onFileSelected,
  accept = "video/*",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    e.target.value = ""; // reset input so the same file can be picked again
  };

  return (
    <div className={className} style={{ textAlign: 'center' }}>
      <UploadButton onClick={handleButtonClick}>
        Choose Video
      </UploadButton>
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

export default FilePicker;
