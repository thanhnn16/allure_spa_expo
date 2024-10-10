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

// Hàm tạo code_verifier
export const generateCodeVerifier = (): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codeVerifier = '';
  for (let i = 0; i < 43; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    codeVerifier += charset[randomIndex];
  }
  return codeVerifier;
};

// Hàm tạo code_challenge
export const generateCodeChallenge = (codeVerifier: string): string => {
  const hashed = CryptoJS.SHA256(codeVerifier);
  const base64Encoded = CryptoJS.enc.Base64.stringify(hashed);
  return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Lấy URL OAuth của Zalo
export const getZaloOauthUrl = (codeChallenge: string): string => {
  return `https://oauth.zaloapp.com/v4/permission?app_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256&response_type=code`;
};

// Mở URL đăng nhập Zalo
export const openZaloLogin = (codeChallenge: string): void => {
  const url = getZaloOauthUrl(codeChallenge);
  Linking.openURL(url);
};

// Lấy AccessToken từ OAuth code
export const getAccessToken = async (oauthCode: string, codeVerifier: string): Promise<AccessTokenResponse | undefined> => {
  try {
    const response = await axios.post<AccessTokenResponse>('https://oauth.zaloapp.com/v4/access_token', {
      app_id: clientId,
      app_secret: clientSecret,
      code: oauthCode,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });

    const { access_token, refresh_token, expires_in } = response.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In:', expires_in);

    // Trả về các token để sử dụng tiếp
    return { access_token, refresh_token, expires_in };
  } catch (error) {
    console.error('Error fetching AccessToken:', error);
    return undefined;
  }
};

// Làm mới AccessToken bằng RefreshToken
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

    // Trả về các token mới
    return { access_token, refresh_token, expires_in };
  } catch (error) {
    console.error('Error refreshing AccessToken:', error);
    return undefined;
  }
};

// Xác minh RefreshToken
export const validateRefreshToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const response = await axios.post<ValidateRefreshTokenResponse>('https://oauth.zaloapp.com/v4/refresh_token/validate', {
      app_id: clientId,
      refresh_token: refreshToken,
    });

    if (response.data.errorCode === 0) {
      console.log('RefreshToken còn hiệu lực');
      return true;
    } else {
      console.log('RefreshToken đã hết hiệu lực');
      return false;
    }
  } catch (error) {
    console.error('Error validating RefreshToken:', error);
    return false;
  }
};

// Lấy thông tin người dùng từ AccessToken
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

// Đăng xuất khỏi Zalo
export const logoutFromZalo = (): void => {
  const url = `https://oauth.zaloapp.com/v4/logout?app_id=${clientId}`;
  Linking.openURL(url);
};
