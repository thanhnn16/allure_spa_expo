import axios from 'axios';

interface OtpResponse {
  success: boolean;
  message: string;
}

export const sendOtpRequest = async (phoneNumber: string, accessToken: string): Promise<OtpResponse | undefined> => {
  try {
    const response = await axios.post<OtpResponse>('https://api.zalo.me/otp/send', {
      phoneNumber,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('OTP sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return undefined; 
  }
};
