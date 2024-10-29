export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLoginResponseParams {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface UserRegisterResponseParams {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface UserLoginZaloParams {
  phoneNumber: string;
  fullName: string;
}

