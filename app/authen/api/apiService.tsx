import axios from 'axios';

const API_BASE_URL = 'https://allurespa.io.vn/api/auth';

export const registerUser = async (fullName: string, phoneNumber: string, password: string, confirmPassword: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      full_name: fullName,
      phone_number: phoneNumber,
      password: password,
      password_confirmation: confirmPassword,
    });

    if (response.status === 201) {
      const { message, data } = response.data;
      return {
        success: true,
        message: message || 'Registration successful',
        user: data.user,
        token: data.token,
      };
    }
  } catch (error) {
    const err = error as any;
    if (err.response) {
      const { message, status_code } = err.response.data;
      if (status_code === 422) {
        return { success: false, message: message || 'Validation error' };
      }
      return { success: false, message: message || 'Registration failed' };
    }
    return { success: false, message: 'Network error, please try again' };
  }
};

export const loginUser = async (phoneNumber: any, password: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      phone_number: phoneNumber,
      password: password,
    });

    if (response.status === 200) {
      const { message, data } = response.data;
      return {
        success: true,
        message: message || 'Login successful',
        user: data.user,
        token: data.token,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { message, status_code } = error.response.data;
      if (status_code === 401) {
        return { success: false, message: message || 'Invalid login credentials' };
      }
      return { success: false, message: message || 'Login failed' };
    }
    return { success: false, message: 'Network error, please try again' };
  }
};
