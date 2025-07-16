import React from 'react';
import styled from 'styled-components';

interface TrimButtonProps {
  onTrim: () => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

const TrimButton: React.FC<TrimButtonProps> = ({ onTrim, isLoading, disabled = false }) => {
  return (
    <Button onClick={onTrim} disabled={disabled || isLoading}>
      {isLoading ? 'Trimming...' : 'Trim Video'}
    </Button>
  );
};

const Button = styled.button`
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

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export default TrimButton;
