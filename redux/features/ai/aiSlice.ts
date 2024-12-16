import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FunctionCallingMode, GoogleGenerativeAI } from "@google/generative-ai";
import { RootState } from "../../store";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { AiConfig } from '@/types/ai-config';
import { useAuth } from '@/hooks/useAuth';
import { ERROR_KEYS } from '@/constants/errorMessages';

interface AiState {
  messages: Array<{
    role: 'user' | 'model';
    parts: Array<{ text?: string; image?: { data: string; mimeType: string } }>;
    isSystemMessage?: boolean;
    isTemporary?: boolean;
  }>;
  isLoading: boolean;
  isThinking: boolean;
  error: string | null;
  configs: AiConfig[] | null;
}

const initialState: AiState = {
  messages: [],
  isLoading: false,
  isThinking: false,
  error: null,
  configs: null
};

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  let errorKey = ERROR_KEYS.UNDEFINED_ERROR;

  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message; // Trả về key lỗi
  }

  return errorKey;
};

// Helper function to get active config by type
const getActiveConfigByType = (configs: AiConfig[] | null, type: string): AiConfig | undefined => {
  return configs?.find(c => c.type === type && c.is_active);
};

// Helper function to get API key from config
const getApiKey = (config: AiConfig | undefined): string => {
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

// Fetch AI configs from server
export const fetchAiConfigs = createAsyncThunk(
  'ai/fetchConfigs',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await AxiosInstance().get('/ai-configs');
      if (!response.data?.data?.configs) {
        throw new Error('Invalid config data received');
      }
      return response.data.data.configs;
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('Failed to fetch AI configs:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thêm interface cho function call response
interface FunctionCallResponse {
  name: string;
  args: any;
}

// Thêm interface cho candidate response
interface CandidateResponse {
  content: {
    parts: Array<{
      text?: string;
      functionCall?: FunctionCallResponse;
    }>;
  };
}

// Thêm interface cho message
interface AiMessage {
  role: 'user' | 'model';
  parts: Array<{ text?: string; image?: { data: string; mimeType: string } }>;
  isSystemMessage?: boolean;
}

// Cập nhật helper function
const getActiveConfig = (configs: any[]) => {
  return configs?.find(config =>
    config.type === 'general_assistant' &&
    config.is_active
  );
};

// Send text message to AI
export const sendTextMessage = createAsyncThunk(
  'ai/sendTextMessage',
  async ({
    text,
    isSystemMessage = false
  }: {
    text: string;
    isSystemMessage?: boolean
  }, { getState, dispatch, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const config = getActiveConfig(state.ai.configs);

      if (isSystemMessage) {
        return {
          text: '',
          isSystemMessage: true,
          skipResponse: true
        };
      }

      const apiKey = config?.api_key || config?.global_api_key;
      const genAI = new GoogleGenerativeAI(apiKey);

      // Xử lý function declarations
      let toolsConfig = undefined;
      if (config?.function_declarations) {
        const declarations = typeof config.function_declarations === 'string'
          ? JSON.parse(config.function_declarations)
          : config.function_declarations;

        if (Array.isArray(declarations)) {
          toolsConfig = [{
            functionDeclarations: declarations
          }];
        }
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: config?.context,
        tools: toolsConfig,
        toolConfig: toolsConfig ? { functionCallingConfig: { mode: "AUTO" as FunctionCallingMode } } : undefined
      });

      const chat = model.startChat({
        history: state.ai.messages
          .filter((msg: any) => msg.parts[0]?.text?.trim() !== '')
          .map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.parts[0]?.text || '' }]
          })),
        generationConfig: {
          temperature: config?.temperature || 0.9,
          topK: config?.top_k || 40,
          topP: config?.top_p || 0.95,
          maxOutputTokens: config?.max_tokens || 8192,
        },
      });

      console.log('history: ', state.ai.messages);

      console.log('text: ', text.trim());

      const result = await chat.sendMessage(text.trim());
      const response = result.response;

      // Kiểm tra parts trong response
      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts || parts.length === 0) {
        throw new Error('Invalid response format');
      }

      // Xử lý text response (nếu có)
      let responseText = '';
      if (parts[0]?.text) {
        responseText = parts[0].text;
      }

      // Xử lý function call (nếu có)
      const functionCallPart = parts.find(part => part.functionCall);
      if (functionCallPart?.functionCall) {
        try {
          // Gọi API function
          const functionResult = await handleFunctionCall(
            functionCallPart.functionCall.name,
            functionCallPart.functionCall.args || {}
          );

          // Gửi kết quả function call lại cho AI
          const followUpResult = await chat.sendMessage(
            JSON.stringify({
              success: true,
              data: functionResult.data
            })
          );

          // Kết hợp response ban đầu với kết quả function call
          const finalResponse = followUpResult.response.text();
          if (finalResponse && finalResponse.trim() !== '') {
            responseText += '\n' + finalResponse;
          }
        } catch (error) {
          console.error('Function call processing error:', error);
          responseText += '\nXin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.';
        }
      }

      // Trả về kết quả cuối cùng
      return responseText || 'Xin lỗi, tôi không hiểu yêu cầu của bạn. Vui lòng thử lại.';

    } catch (error: any) {
      console.error("Send text error:", error);
      return rejectWithValue(error.message || 'Lỗi không xác định khi gửi tin nhắn');
    }
  }
);

// Cập nhật hàm xử lý function call
const handleFunctionCall = async (functionName: string, args: any) => {
  console.log('Calling function:', functionName, 'with args:', args);

  try {
    // Thêm user_id vào args nếu là getUserVouchers
    if (functionName === 'getUserVouchers') {
      const { user } = useAuth();
      args = {
        ...args,
        user_id: user?.id
      };
    }

    const response = await AxiosInstance().post('/ai/function-call', {
      function: functionName,
      args: args
    });
    console.log('Function call response:', response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Function call error:', error);
    console.error(`Function call error: ${JSON.stringify(error.response.data)}`);
    throw error;
  }
};

// Send image message to AI
export const sendImageMessage = createAsyncThunk(
  'ai/sendImageMessage',
  async ({
    text,
    images
  }: {
    text: string;
    images: Array<{ data: string; mimeType: string }>;
  }, { getState, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const config = getActiveConfig(state.ai.configs);

      const apiKey = config?.api_key || config?.global_api_key;
      const genAI = new GoogleGenerativeAI(apiKey);

      // Xử lý function declarations tương tự như sendTextMessage
      let toolsConfig = undefined;
      if (config?.function_declarations) {
        const declarations = typeof config.function_declarations === 'string'
          ? JSON.parse(config.function_declarations)
          : config.function_declarations;

        if (Array.isArray(declarations)) {
          toolsConfig = [{
            functionDeclarations: declarations
          }];
        }
      }

      const model = genAI.getGenerativeModel({
        model: config?.model_type || 'gemini-1.5-flash',
        systemInstruction: config?.context,
        tools: toolsConfig,
        toolConfig: toolsConfig ? { functionCallingConfig: { mode: "AUTO" as FunctionCallingMode } } : undefined
      });

      const chat = model.startChat({
        history: state.ai.messages
          .filter((msg: any) => msg.parts[0]?.text?.trim() !== '')
          .map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.parts[0]?.text || '' }]
          })),
        generationConfig: {
          temperature: config?.temperature || 0.6,
          topK: config?.top_k || 30,
          topP: config?.top_p || 0.9,
          maxOutputTokens: config?.max_tokens || 2048,
        },
      });

      // Tạo message parts với text và hình ảnh
      const messageParts = [
        { text: text || '' },
        ...images.map(img => ({
          inlineData: {
            data: img.data,
            mimeType: img.mimeType
          }
        }))
      ];

      // Sử dụng sendMessage thay vì generateContent
      const result = await chat.sendMessage(messageParts);
      const response = result.response;

      let responseText = response.text() || '';

      // Xử lý function call nếu có
      const functionCallPart = response.candidates?.[0]?.content?.parts?.find(part => part.functionCall);
      if (functionCallPart?.functionCall) {
        try {
          const functionResult = await handleFunctionCall(
            functionCallPart.functionCall.name,
            functionCallPart.functionCall.args || {}
          );

          const followUpResult = await chat.sendMessage(
            JSON.stringify({
              success: true,
              data: functionResult.data
            })
          );

          const finalResponse = followUpResult.response.text();
          if (finalResponse && finalResponse.trim() !== '') {
            responseText += '\n' + finalResponse;
          }
        } catch (error) {
          console.error('Function call processing error:', error);
          responseText += '\nXin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.';
        }
      }

      // Lưu lại format gốc của message để hiển thị
      const savedParts = [
        { text: responseText },
        ...images.map(img => ({
          image: {
            data: img.data,
            mimeType: img.mimeType
          }
        }))
      ];

      return {
        text: responseText,
        parts: savedParts
      };
    } catch (error: any) {
      console.error("Send image error:", error);
      return rejectWithValue(error.message || 'Lỗi không xác định khi gửi hình ảnh');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearMessages: (state: AiState) => {
      state.messages = [];
      state.error = null;
    },
    clearError: (state: AiState) => {
      state.error = null;
    },
    addTemporaryMessage: (state: AiState, action: any) => {
      state.messages.push({
        role: 'model',
        parts: [{ text: action.payload }],
        isTemporary: true
      });
    },
    removeTemporaryMessage: (state: AiState) => {
      if (state.messages.length > 0 && state.messages[state.messages.length - 1].isTemporary) {
        state.messages.pop();
      }
    },
    updateLastMessage: (state: AiState, action: any) => {
      if (state.messages.length > 0) {
        state.messages[state.messages.length - 1] = {
          role: 'model',
          parts: [{ text: action.payload }]
        };
      }
    }
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch configs
      .addCase(fetchAiConfigs.pending, (state: AiState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAiConfigs.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.configs = action.payload;
        state.error = null;
      })
      .addCase(fetchAiConfigs.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Send text message
      .addCase(sendTextMessage.pending, (state: AiState, action: any) => {
        state.isLoading = true;
        state.isThinking = true;
        state.error = null;
        if (action.meta.arg.text) {
          state.messages.push({
            role: 'user',
            parts: [{ text: action.meta.arg.text }],
            isSystemMessage: action.meta.arg.isSystemMessage
          });
        }
      })
      .addCase(sendTextMessage.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = null;

        // Remove temporary message if exists
        if (state.messages.length > 0 && state.messages[state.messages.length - 1].isTemporary) {
          state.messages.pop();
        }

        if (!action.payload.skipResponse) {
          state.messages.push({
            role: 'model',
            parts: [{ text: action.payload }]
          });
        }
      })
      .addCase(sendTextMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = action.payload as string;
        // Remove the last message if it was a loading message
        if (state.messages.length > 0 && state.messages[state.messages.length - 1].parts[0].text === 'Để tôi kiểm tra thông tin cho bạn...') {
          state.messages.pop();
        }
      })

      // Send image message
      .addCase(sendImageMessage.pending, (state: AiState, action: any) => {
        state.isLoading = true;
        state.isThinking = true;
        state.error = null;
        state.messages.push({
          role: 'user',
          parts: [
            { text: action.meta.arg.text },
            ...action.meta.arg.images.map((img: any) => ({ image: img }))
          ]
        });
      })
      .addCase(sendImageMessage.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = null;
        state.messages.push({
          role: 'model',
          parts: action.payload.parts || [{ text: action.payload.text }]
        });
      })
      .addCase(sendImageMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = action.payload as string;
        if (state.messages.length > 0 && state.messages[state.messages.length - 1].parts[0].text === 'Để tôi kiểm tra thông tin cho bạn...') {
          state.messages.pop();
        }
      });
  }
});

export const {
  clearMessages,
  clearError,
  addTemporaryMessage,
  removeTemporaryMessage,
  updateLastMessage
} = aiSlice.actions;

export default aiSlice.reducer;