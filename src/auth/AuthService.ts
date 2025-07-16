import { PublicClientApplication } from '@azure/msal-browser';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || '',
    authority: process.env.REACT_APP_AUTHORITY || '',
    redirectUri: process.env.REACT_APP_REDIRECT_URI || '', 
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
});

export async function signIn() {
  const loginRequest = {
    scopes: [process.env.REACT_APP_API_SCOPE || 'openid'],
    prompt: 'login'
  };

  try {
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
export async function getAccessToken(): Promise<string> {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw new Error('User not logged in');
  }

  const request = {
    scopes: [process.env.REACT_APP_API_SCOPE as string],
    account: account
  };

  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    console.warn('Silent token acquisition failed, attempting loginRedirect');
    await msalInstance.loginRedirect(request);
    throw error;
  }
}




