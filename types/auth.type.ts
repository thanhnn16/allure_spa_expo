import { User } from "./user.type";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  status_code: number;
  data: {
    user: User;
    token: string;
  } | null;
}

export enum AuthErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  PHONE_ALREADY_EXISTS = 'PHONE_ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_CONTACT_INFO = 'MISSING_CONTACT_INFO',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  INVALID_PASSWORD_FORMAT = 'INVALID_PASSWORD_FORMAT',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  INVALID_NAME_FORMAT = 'INVALID_NAME_FORMAT',
  PASSWORDS_NOT_MATCH = 'PASSWORDS_NOT_MATCH',
  WRONG_CURRENT_PASSWORD = 'WRONG_CURRENT_PASSWORD',
  PASSWORD_CHANGE_FAILED = 'PASSWORD_CHANGE_FAILED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_VERIFICATION_CODE = 'INVALID_VERIFICATION_CODE',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  PHONE_NOT_FOUND = 'PHONE_NOT_FOUND',
  INVALID_VERIFICATION_TYPE = 'INVALID_VERIFICATION_TYPE',
  EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED',
  PHONE_ALREADY_VERIFIED = 'PHONE_ALREADY_VERIFIED',
  VERIFICATION_SEND_FAILED = 'VERIFICATION_SEND_FAILED'
}

export interface AuthError {
  code: AuthErrorCode | string;
  message: string;
} 