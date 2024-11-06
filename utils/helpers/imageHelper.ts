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