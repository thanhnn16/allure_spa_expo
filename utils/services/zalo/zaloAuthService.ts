import axios from 'axios';
import CryptoJS from 'crypto-js';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ValidateRefreshTokenResponse {
  errorCode: number;
  message?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
  birthday?: string;
  gender?: string;
  // Add other fields as needed based on Zalo API response
}

const clientId = process.env.EXPO_PUBLIC_ZALO_CLIENT_ID;
const clientSecret = process.env.EXPO_PUBLIC_ZALO_CLIENT_SECRET;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Tạo redirect URI dựa trên platform
export const getRedirectUri = () => {
  if (Platform.OS === 'web') {
    return `${apiUrl}/zalo-login-progress`;
  }
  const scheme = Constants.expoConfig?.scheme || 'allurespa';
  return `${scheme}://oauth`;
};

// Tạo state để bảo mật
export const generateState = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

// Cập nhật lại hàm getZaloOauthUrl
export const getZaloOauthUrl = (codeChallenge: string, state: string): string => {
  const redirectUri = encodeURIComponent(getRedirectUri());

  return `https://oauth.zaloapp.com/v4/permission?app_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&state=${state}&code_challenge_method=S256`;
};

// Thêm hàm mới để xử lý login
export const handleZaloLogin = async (
  codeChallenge: string,
  state: string
): Promise<void> => {
  const zaloUrl = getZaloOauthUrl(codeChallenge, state);

  if (Platform.OS === 'web') {
    window.location.href = zaloUrl;
    return;
  }

  try {
    const canOpenZalo = await Linking.canOpenURL('zalo://');
    if (canOpenZalo) {
      await Linking.openURL(`zalo://oauth?${new URLSearchParams({
        app_id: clientId!,
        code_challenge: codeChallenge,
        redirect_uri: getRedirectUri(),
        state
      }).toString()}`);
    } else {
      throw new Error('no_zalo_app');
    }
  } catch (error) {
    // Nếu không mở được Zalo app, trả về URL để mở WebView
    throw { type: 'webview_required', url: zaloUrl };
  }
};

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

// Open Zalo login URL
export const openZaloLogin = (codeChallenge: string, state: string): void => {
  const url = getZaloOauthUrl(codeChallenge, state);
  Linking.openURL(url);
};

// Fetch AccessToken using OAuth code
export const getAccessToken = async (oauthCode: string, codeVerifier: string): Promise<AccessTokenResponse | undefined> => {
  try {
    const response = await axios.post<AccessTokenResponse>('https://oauth.zaloapp.com/v4/access_token', null, {
      params: {
        code: oauthCode,
        app_id: clientId,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      },
      headers: {
        'secret_key': clientSecret,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching AccessToken:', error);
    return undefined;
  }
};

// Refresh AccessToken using RefreshToken
export const refreshAccessToken = async (refreshToken: string): Promise<AccessTokenResponse | undefined> => {
  try {
    const response = await axios.post<AccessTokenResponse>('https://oauth.zaloapp.com/v4/access_token', null, {
      params: {
        refresh_token: refreshToken,
        app_id: clientId,
        grant_type: 'refresh_token',
      },
      headers: {
        'secret_key': clientSecret,
      },
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
    const response = await axios.get<ValidateRefreshTokenResponse>('https://oauth.zaloapp.com/v4/refresh_token/validate', {
      params: {
        refresh_token: refreshToken,
        app_id: clientId,
      },
      headers: {
        'secret_key': clientSecret,
      },
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
