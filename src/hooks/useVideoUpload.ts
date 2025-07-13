import { useState, useCallback } from 'react';
import { UploadSasUrlResponse } from '../types/video';
import { apiClient } from '../clients/ApiClient';


export function useVideoUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSasUrlResponse, setUploadSasUrlResponse] = useState<UploadSasUrlResponse | null>(null);

  const getUploadSasUrl = useCallback(async (): Promise<UploadSasUrlResponse> => {
    try {
      return await apiClient.getUploadSasUrl();
    } catch (error) {
      console.error('❌ Error in getUploadSasUrl:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get upload SAS URL';
      throw new Error(errorMessage);
    }
  }, []);

  const uploadFileToBlob = useCallback(async (file: File, uploadSasUrlResponse: UploadSasUrlResponse): Promise<void> => {
    await apiClient.uploadVideoToBlob(file, uploadSasUrlResponse);
  }, []);

  const uploadVideo = useCallback(async (file: File): Promise<UploadSasUrlResponse> => {
    if (!file) {
      console.error('❌ No file selected for upload');
      setError('Please select a file first');
      throw new Error('Please select a file first');
    }

    console.log('🎥 Starting video upload process...');
    try {
      setIsLoading(true);
      setError(null);
      
      // Get upload SAS URL
      const result = await getUploadSasUrl();
      setUploadSasUrlResponse(result);
      
      // Upload file to blob storage
      await uploadFileToBlob(file, result);
      
      // Note: isLoading remains true until SignalR callback sets it to false
      
      return result;
      
    } catch (error) {
      console.error('❌ Error in uploadVideo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      setIsLoading(false);
      console.log('❌ Upload process failed');
      throw error;
    }
  }, [getUploadSasUrl, uploadFileToBlob]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const clearUploadResponse = useCallback((): void => {
    setUploadSasUrlResponse(null);
  }, []);

  return {
    state: {
      isLoading,
      error,
      uploadSasUrlResponse
    },
    handlers: {
      uploadVideo,
      getUploadSasUrl,
      uploadFileToBlob,
      clearError,
      clearUploadResponse,
      setError,
      setIsLoading
    }
  };
}
