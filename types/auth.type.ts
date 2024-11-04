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
  message: string;
  status_code: number;
  success: boolean;
  data: {
    user: User;
    token: string;
  }
} 