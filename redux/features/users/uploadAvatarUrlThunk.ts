import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const uploadAvatarUrlThunk = createAsyncThunk(
  "user/uploadAvatar",
  async (formData: FormData, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().post<User>("user/avatar", formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => {
          return data;
        },
      });

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || 'Upload avatar failed');
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      return rejectWithValue(error.response?.data?.message || "Upload avatar failed");
    }
  }
);

const processImageForUpload = async (uri: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    // Kiểm tra kích thước file gốc
    if (fileInfo.exists && fileInfo.size > 2 * 1024 * 1024) {
      // Nếu file lớn hơn 2MB, resize và nén mạnh hơn
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],
        {
          compress: 0.3,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      return manipulatedImage.uri;
    }
    
    // Nếu file nhỏ hơn 2MB, chỉ nén nhẹ
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return manipulatedImage.uri;
    
  } catch (error: any) {
    console.error('Error processing image:', error);
    throw new Error(`Không thể xử lý hình ảnh: ${error.message}`);
  }
};
