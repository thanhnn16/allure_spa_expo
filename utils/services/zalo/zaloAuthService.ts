import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Linking } from 'react-native';

const clientId = '3131373079387573469';
const clientSecret = '';
const redirectUri = 'myapp://allure_spa_expo';

interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface ValidateRefreshTokenResponse {
  errorCode: number;
  errorMessage: string;
}

interface UserProfile {
  id: string;
  name: string;
}

// Function to generate code_verifier
export const generateCodeVerifier = (): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codeVerifier = '';
  for (let i = 0; i < 43; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    codeVerifier += charset[randomIndex];
  }
  return codeVerifier;
};

// Function to generate code_challenge
export const generateCodeChallenge = (codeVerifier: string): string => {
  const hashed = CryptoJS.SHA256(codeVerifier);
  const base64Encoded = CryptoJS.enc.Base64.stringify(hashed);
  return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Get Zalo OAuth URL
export const getZaloOauthUrl = (codeChallenge: string, state: string): string => {
  return `https://oauth.zaloapp.com/v4/permission?app_id=${clientId}&code_challenge=${codeChallenge}&state=${state}`;
};

// Open Zalo login URL
export const openZaloLogin = (codeChallenge: string, phoneNumber: string, fullName: string): void => {
  const state = 'someStateValue'; // You can replace 'someStateValue' with the actual state value you need
  const url = getZaloOauthUrl(codeChallenge, state);
  Linking.openURL(url);
};

// Fetch AccessToken using OAuth code
export const getAccessToken = async (oauthCode: string, codeVerifier: string): Promise<AccessTokenResponse | undefined> => {
  console.log('Fetching access token with oauthCode:', oauthCode);
  try {
    const response = await axios.post<AccessTokenResponse>('https://oauth.zaloapp.com/v4/access_token', {
      app_id: clientId,
      app_secret: clientSecret,
      code: oauthCode,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });

    // Log the received tokens
    const { access_token, refresh_token, expires_in } = response.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In:', expires_in);

    return { access_token, refresh_token, expires_in };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching AccessToken:', error.response?.data || error.message);
    } else {
      console.error('Error fetching AccessToken:', error);
    }
    return undefined;
  }
};

// Refresh AccessToken using RefreshToken
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse | undefined> => {
  try {
    const response = await axios.post<RefreshTokenResponse>('https://oauth.zaloapp.com/v4/access_token', {
      app_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token, expires_in } = response.data;
    console.log('New Access Token:', access_token);
    console.log('New Refresh Token:', refresh_token);
    console.log('Expires In:', expires_in);


    return { access_token, refresh_token, expires_in };
  } catch (error) {
    console.error('Error refreshing AccessToken:', error);
    return undefined;
  }
};

// Validate RefreshToken
export const validateRefreshToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const response = await axios.post<ValidateRefreshTokenResponse>('https://oauth.zaloapp.com/v4/refresh_token/validate', {
      app_id: clientId,
      refresh_token: refreshToken,
    });

    if (response.data.errorCode === 0) {
      console.log('RefreshToken is valid');
      return true;
    } else {
      console.log('RefreshToken is invalid');
      return false;
    }
  } catch (error) {
    console.error('Error validating RefreshToken:', error);
    return false;
  }
};

// Fetch user profile using AccessToken
export const getZaloUserProfile = async (accessToken: string): Promise<UserProfile | undefined> => {
  try {
    const response = await axios.get<UserProfile>(`https://graph.zalo.me/v4.0/me?access_token=${accessToken}`);
    const userProfile = response.data;
    console.log('User Profile:', userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return undefined;
  }
};

// Logout from Zalo
export const logoutFromZalo = (): void => {
  const url = `https://oauth.zaloapp.com/v4/logout?app_id=${clientId}`;
  Linking.openURL(url);
};
