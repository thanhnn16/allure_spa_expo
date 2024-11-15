import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const SUPPORTED_EXTENSIONS = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'heic': 'image/heic',
    'heif': 'image/heif'
};

type SupportedExtension = keyof typeof SUPPORTED_EXTENSIONS;

// Thêm interface để phân biệt rõ kiểu dữ liệu trả về
interface ProcessedImage {
  base64: string;        // Chuỗi base64 thuần túy cho API
  uri: string;           // URI đầy đủ cho việc hiển thị
}

export const convertImageToBase64 = async (uri: string): Promise<ProcessedImage> => {
    try {
        // Nén và resize ảnh trước khi chuyển đổi
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [
                { resize: { width: 720 } },
            ],
            {
                compress: 0.65,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );

        // Chỉ trả về chuỗi base64 thuần túy, không có prefix
        const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return {
            base64: base64,                                    // Cho API
            uri: `data:image/jpeg;base64,${base64}`           // Cho UI
        };
    } catch (error: any) {
        console.error('Error processing image:', error);
        throw new Error(`Không thể xử lý hình ảnh: ${error.message}`);
    }
};

export const isValidImageFormat = (uri: string): boolean => {
    const extension = uri.split('.').pop()?.toLowerCase() as SupportedExtension;
    return !!SUPPORTED_EXTENSIONS[extension];
};

export const validateImage = async (uri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!fileInfo.exists) {
    throw new Error('File không tồn tại');
  }

  if (fileInfo.size > maxSize) {
    throw new Error('Kích thước file không được vượt quá 2MB');
  }

  return true;
};

export const processImageForUpload = async (uri: string): Promise<string> => {
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