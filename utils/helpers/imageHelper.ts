import * as FileSystem from 'expo-file-system';

// Định nghĩa các định dạng ảnh được hỗ trợ
const SUPPORTED_EXTENSIONS = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg', 
  'png': 'image/png',
  'webp': 'image/webp',
  'heic': 'image/heic',
  'heif': 'image/heif'
};

type SupportedExtension = keyof typeof SUPPORTED_EXTENSIONS;

export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    // Lấy phần mở rộng từ URI và chuyển thành chữ thường
    const extension = uri.split('.').pop()?.toLowerCase() as SupportedExtension;
    
    // Kiểm tra xem định dạng có được hỗ trợ không
    if (!extension || !SUPPORTED_EXTENSIONS[extension]) {
      throw new Error(`Định dạng ảnh không được hỗ trợ: ${extension}`);
    }

    // Đọc file dưới dạng base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Tạo chuỗi base64 với MIME type phù hợp
    return `data:${SUPPORTED_EXTENSIONS[extension]};base64,${base64}`;
  } catch (error: any) {
    console.error('Error converting image to base64:', error);
    throw new Error(`Không thể chuyển đổi hình ảnh sang base64: ${error.message}`);
  }
};

// Helper function để kiểm tra xem một URI có phải là định dạng ảnh hợp lệ không
export const isValidImageFormat = (uri: string): boolean => {
  const extension = uri.split('.').pop()?.toLowerCase() as SupportedExtension;
  return !!SUPPORTED_EXTENSIONS[extension];
};