export interface User {
    id: number;
    fullName: string;
    phoneNumber: string;
    email?: string;
  }
  
  export interface UserLoginResponseParams {
    success: boolean;
    message: string;
    user: User;
    token: string;
  }
  
  export interface UserRegisterResponseParams {
    success: boolean;
    message: string;
    user: User;
    token: string;
  }