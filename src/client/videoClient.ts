import * as AuthService from '../auth/AuthService';

//remove all console.log statements
export interface UploadSasUrlResponse {
  userId: string;
  uploadSasUrl: string;
}

const API_SCOPE = process.env.REACT_APP_API_SCOPE as string;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

async function getAccessToken() {
  const account = AuthService.msalInstance.getActiveAccount();
  if (!account) throw new Error('User not logged in.');
  
  const request = { scopes: [API_SCOPE] };
  const response = await AuthService.msalInstance.acquireTokenSilent(request);
  return response.accessToken;
}

export async function getUploadSasUrl(): Promise<UploadSasUrlResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/api/video/upload-sas-url`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get upload SAS URL: ${response.status}`);
  }

  const result: UploadSasUrlResponse = await response.json();
  return result;
}

export async function uploadFileToBlob(file: File, uploadSasUrl: string, userId: string): Promise<void> {
  const response = await fetch(uploadSasUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-meta-userId': userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Blob upload failed: ${response.status}`);
  }
}
