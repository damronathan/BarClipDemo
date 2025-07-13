import { UploadSasUrlResponse } from '../types/video';
import { apiClient } from '../clients/ApiClient';

export class VideoUploadService {
  async getUploadSasUrl(): Promise<UploadSasUrlResponse> {
    return await apiClient.getUploadSasUrl();
  }

  async uploadFileToBlob(file: File, uploadSasUrlResponse: UploadSasUrlResponse): Promise<void> {
    await apiClient.uploadVideoToBlob(file, uploadSasUrlResponse);
  }
}

export const videoUploadService = new VideoUploadService();
