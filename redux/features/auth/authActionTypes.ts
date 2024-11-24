export const AUTH_ACTIONS = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout', 
  REGISTER: 'auth/register',
  VERIFY_OTP: 'auth/verifyOtp',
  GUEST_LOGIN: 'auth/guestLogin',
  // Add other auth-related action types here
} as const;