import { useState, useCallback } from 'react';
import { signalRClient } from '../clients/SignalRClient';

export function useSignalR() {
  const [sasUrl, setSasUrl] = useState<string | null>(null);

  const startConnection = useCallback(async (accessToken: string, onTrimSucceeded?: (url: string) => void): Promise<void> => {
    try {
      await signalRClient.startConnection(accessToken, (url: string) => {
        setSasUrl(url);
        if (onTrimSucceeded) {
          onTrimSucceeded(url);
        }
      });
    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
      throw error;
    }
  }, []);

  const stopConnection = useCallback((): void => {
    signalRClient.stopConnection();
  }, []);

  const clearSasUrl = useCallback((): void => {
    setSasUrl(null);
  }, []);

  return {
    state: {
      sasUrl
    },
    handlers: {
      startConnection,
      stopConnection,
      clearSasUrl
    }
  };
}
