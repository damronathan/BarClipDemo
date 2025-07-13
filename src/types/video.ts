export interface UploadSasUrlResponse {
  userId: string;
  uploadSasUrl: string;
}

export interface FilePickerProps {
  className?: string;
  onFileSelected: (file: File) => void;
  accept?: string;
}

export interface VideoFileInfo {
  name: string;
  type: string;
  size: number;
}

export interface VideoUploadState {
  isLoading: boolean;
  error: string | null;
  uploadSasUrlResponse: UploadSasUrlResponse | null;
}

export interface VideoProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
}
