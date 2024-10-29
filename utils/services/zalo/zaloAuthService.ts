import { ZALO_CONSTANTS } from '@/utils/constants/zalo';
import axios from 'axios';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

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
}

const clientId = process.env.EXPO_PUBLIC_ZALO_CLIENT_ID;
const clientSecret = process.env.EXPO_PUBLIC_ZALO_CLIENT_SECRET;
const appUrl = process.env.EXPO_PUBLIC_SERVER_URL;

// Tạo redirect URI dựa trên platform
export const getRedirectUri = () => {
  // if (Platform.OS === 'web') {
  console.log('appUrl', appUrl);
  console.log('full url', `${appUrl}zalo-login-progress`);
  return `${appUrl}zalo-login-progress`;

  // }
  // const scheme = Constants.expoConfig?.scheme || 'allurespa';
  // return `${scheme}://oauth`;
};

// Tạo state để bảo mật
export const generateState = (): string => {
  return Crypto.getRandomBytes(16).toString();
};

// Cập nhật lại hàm getZaloOauthUrl
export const getZaloOauthUrl = (codeChallenge: string, state: string): string => {
  const redirectUri = encodeURIComponent(getRedirectUri());
  return `${ZALO_CONSTANTS.OAUTH_URL}/permission?app_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&state=${state}&code_challenge_method=S256`;
};

// Thêm custom error class
export class ZaloAuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ZaloAuthError';
  }
}

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
export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier
  );

  // Convert digest to Uint8Array
  const digestArray = new Uint8Array(digest.match(/[\da-f]{2}/gi)!.map(h => parseInt(h, 16)));

  // Convert to base64 using btoa and Uint8Array
  const base64Encoded = btoa(String.fromCharCode.apply(null, [...digestArray]));

  // Make the string URL safe
  return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Open Zalo login URL
export const openZaloLogin = (codeChallenge: string, state: string): void => {
  const url = getZaloOauthUrl(codeChallenge, state);
  Linking.openURL(url);
};

// Fetch AccessToken using OAuth code
export const getAccessToken = async (oauthCode: string, codeVerifier: string): Promise<AccessTokenResponse> => {
  try {
    const response = await axios.post<AccessTokenResponse>(
      `${ZALO_CONSTANTS.OAUTH_URL}/access_token`,
      null,
      {
        params: {
          code: oauthCode,
          app_id: clientId,
          grant_type: 'authorization_code',
          code_verifier: codeVerifier,
        },
        headers: {
          'secret_key': clientSecret,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ZaloAuthError(
        'ACCESS_TOKEN_ERROR',
        error.response?.data?.message || 'Failed to get access token'
      );
    }
    throw error;
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
    const response = await axios.get<UserProfile>(`${ZALO_CONSTANTS.GRAPH_URL}/me?access_token=${accessToken}`);
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
