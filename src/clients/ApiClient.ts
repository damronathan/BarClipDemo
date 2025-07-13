import { msalInstance } from '../services/AuthService';
import { UploadSasUrlResponse } from '../types/video';

/**
 * Centralized API client for all API operations
 */
export class ApiClient {
  private baseUrl: string;
  private scope: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || '';
    this.scope = process.env.REACT_APP_API_SCOPE || '';
  }

  /**
   * Gets an access token for API requests
   * @returns Promise<string> - The access token
   */
  async getAccessToken(): Promise<string> {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      throw new Error("No active account. User might not be signed in.");
    }

    const request = {
      scopes: [this.scope],
    };
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  }

  /**
   * Creates headers for authenticated API requests
   * @param accessToken - The access token to include
   * @param contentType - Optional content type (defaults to 'application/json')
   * @returns Headers object
   */
  private createAuthHeaders(accessToken: string, contentType: string = 'application/json'): HeadersInit {
    return {
      'Content-Type': contentType,
      'Authorization': `Bearer ${accessToken}`
    };
  }

  /**
   * Makes an authenticated GET request to the API
   * @param endpoint - The API endpoint (without base URL)
   * @returns Promise<T> - The parsed JSON response
   */
  async get<T>(endpoint: string): Promise<T> {
    const accessToken = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.createAuthHeaders(accessToken),
    });

    if (!response.ok) {
      console.error(`❌ API request failed: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Makes a PUT request to blob storage with Azure-specific headers
   * @param url - The SAS URL for blob storage
   * @param body - The file or data to upload
   * @param userId - The user ID for metadata
   * @returns Promise<void>
   */
  async uploadToBlob(url: string, body: File | Blob, userId: string): Promise<void> {
    const response = await fetch(url, {
      method: 'PUT',
      body: body,
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-meta-userId': userId,
      },
    });
    
    if (!response.ok) {
      console.error('❌ Blob upload failed:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Gets the upload SAS URL for video uploads
   * @returns Promise<UploadSasUrlResponse> - The upload SAS URL response
   */
  async getUploadSasUrl(): Promise<UploadSasUrlResponse> {
    try {
      console.log('📥 Getting upload SAS URL...');
      const result: UploadSasUrlResponse = await this.get<UploadSasUrlResponse>('/api/video/upload-sas-url');
      console.log('✅ Upload SAS URL result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in getUploadSasUrl:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get upload SAS URL';
      throw new Error(errorMessage);
    }
  }

  /**
   * Uploads a video file to blob storage
   * @param file - The video file to upload
   * @param uploadSasUrlResponse - The SAS URL response containing upload URL and user ID
   * @returns Promise<void>
   */
  async uploadVideoToBlob(file: File, uploadSasUrlResponse: UploadSasUrlResponse): Promise<void> {
    console.log('📤 Sending PUT request to blob storage...');
    
    if (!uploadSasUrlResponse?.uploadSasUrl) {
      console.error('❌ No upload SAS URL found');
      throw new Error('Failed to get upload SAS URL');
    }

    await this.uploadToBlob(uploadSasUrlResponse.uploadSasUrl, file, uploadSasUrlResponse.userId);
    console.log('📤 Blob upload completed successfully');
  }

  /**
   * Complete video upload process: get SAS URL and upload to blob
   * @param file - The video file to upload
   * @returns Promise<UploadSasUrlResponse> - The upload SAS URL response
   */
  async uploadVideo(file: File): Promise<UploadSasUrlResponse> {
    if (!file) {
      console.error('❌ No file selected for upload');
      throw new Error('Please select a file first');
    }

    console.log('🎥 Starting video upload process...');
    try {
      // Get upload SAS URL
      const result = await this.getUploadSasUrl();
      
      // Upload file to blob storage
      await this.uploadVideoToBlob(file, result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error in uploadVideo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Gets the API base URL
   * @returns string - The API base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Gets the API scope
   * @returns string - The API scope
   */
  getScope(): string {
    return this.scope;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
