import { addItemToCart } from '../cart/cartSlice';
import { AiConfig } from '@/types/ai-config';
import { ERROR_KEYS } from '@/constants/errorMessages';
import AxiosInstance from '@/utils/services/helper/axiosInstance';
import { updateAppointment } from '../appointment/appointmentThunk';

// Helper function để lấy active config theo type
export const getActiveConfigByType = (configs: AiConfig[] | null, type: string): AiConfig | undefined => {
    return configs?.find(c => c.type === type && c.is_active);
};

// Helper function để lấy API key từ config
export const getApiKey = (config: AiConfig | undefined): string => {
    if (!config) {
        throw new Error(ERROR_KEYS.CONFIG_NOT_FOUND);
    }

    if (config.global_api_key) {
        return config.global_api_key;
    }

    if (config.api_key) {
        return config.api_key;
    }

    throw new Error(ERROR_KEYS.MISSING_API_KEY);
};

// Helper function để xử lý API errors
export const handleApiError = (error: any) => {
    console.error('API Error:', error);
    let errorKey = ERROR_KEYS.UNDEFINED_ERROR;

    if (error.response?.data?.message) {
        return error.response.data.message;
    } else if (error.message) {
        return error.message;
    }

    return errorKey;
};

// Helper function để lấy active config
export const getActiveConfig = (configs: any[]) => {
    return configs?.find(config =>
        config.type === 'general_assistant' &&
        config.is_active
    );
};

// Hàm xử lý function call
export const handleFunctionCall = async (
    functionName: string,
    args: any,
    dispatch: any,
    user?: any
) => {
    console.log('Calling function:', functionName, 'with args:', args);

    try {
        // Thêm xử lý đặt lịch
        if (args.data?.is_done) {
            const appointmentData = {
                id: 0, // ID sẽ được server tạo
                staff_id: args.data.staff_id || null,
                appointment_date: args.data.date_time,
                time_slot_id: args.data.time_slot_id,
                status: 'pending',
                appointment_type: 'service',
                note: 'Đặt lịch qua Hana'
            };

            await dispatch(updateAppointment(appointmentData));

            return {
                success: true,
                data: {
                    action: 'bookAppointment',
                    appointment: appointmentData
                }
            };
        }

        // Xử lý các function trong app
        if (functionName === 'seeCart') {
            return {
                success: true,
                data: {
                    action: 'seeCart'
                }
            };
        }

        if (functionName === 'seeProductDetail') {
            return {
                success: true,
                data: {
                    action: 'seeProductDetail',
                    id: args.product_id
                }
            };
        }

        if (functionName === 'seeServiceDetail') {
            return {
                success: true,
                data: {
                    action: 'seeServiceDetail',
                    id: args.service_id
                }
            };
        }

        if (functionName === 'addToCart') {
            dispatch(addItemToCart({
                item: args.product,
                cart_quantity: args.quantity || 1,
                item_type: 'product'
            }));

            return {
                success: true,
                data: {
                    action: 'addToCart',
                    product: args.product
                }
            };
        }

        const response = await AxiosInstance().post('/ai/function-call', {
            function: functionName,
            args: {
                ...args,
                user_id: user?.id
            }
        });
        return response.data.data;

    } catch (error: any) {
        console.error('Function call error:', error);
        console.error(`Function call error: ${JSON.stringify(error.response?.data)}`);
        throw error;
    }
};

// Thêm các interface cần thiết
export interface FunctionCallResponse {
    name: string;
    args: any;
}

export interface CandidateResponse {
    content: {
        parts: Array<{
            text?: string;
            functionCall?: FunctionCallResponse;
        }>;
    };
}

export interface AiMessage {
    role: 'user' | 'model';
    parts: Array<{ text?: string; image?: { data: string; mimeType: string } }>;
    isSystemMessage?: boolean;
} 