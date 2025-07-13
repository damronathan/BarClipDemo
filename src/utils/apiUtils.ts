import { msalInstance } from '../services/AuthService';

/**
 * Gets an access token for API requests
 * @returns Promise<string> - The access token
 */
export const getAccessToken = async (): Promise<string> => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw new Error("No active account. User might not be signed in.");
  }

  const request = {
    scopes: [process.env.REACT_APP_API_SCOPE as string],
  };
  const response = await msalInstance.acquireTokenSilent(request);
  return response.accessToken;
};

/**
 * Creates headers for authenticated API requests
 * @param accessToken - The access token to include
 * @param contentType - Optional content type (defaults to 'application/json')
 * @returns Headers object
 */
export const createAuthHeaders = (accessToken: string, contentType: string = 'application/json'): HeadersInit => {
  return {
    'Content-Type': contentType,
    'Authorization': `Bearer ${accessToken}`
  };
};

/**
 * Makes an authenticated GET request to the API
 * @param endpoint - The API endpoint (without base URL)
 * @returns Promise<T> - The parsed JSON response
 */
export const authenticatedGet = async <T>(endpoint: string): Promise<T> => {
  const accessToken = await getAccessToken();
  const url = `${process.env.REACT_APP_API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: createAuthHeaders(accessToken),
  });

  if (!response.ok) {
    console.error(`❌ API request failed: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Makes a PUT request to blob storage with Azure-specific headers
 * @param url - The SAS URL for blob storage
 * @param body - The file or data to upload
 * @param userId - The user ID for metadata
 * @returns Promise<void>
 */
export const uploadToBlob = async (url: string, body: File | Blob, userId: string): Promise<void> => {
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
};

/**
 * Gets the API base URL from environment variables
 * @returns string - The API base URL
 */
export const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_BASE_URL || '';
};

/**
 * Gets the API scope from environment variables
 * @returns string - The API scope
 */
export const getApiScope = (): string => {
  return process.env.REACT_APP_API_SCOPE || '';
};
