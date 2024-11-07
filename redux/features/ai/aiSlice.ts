import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FunctionCallingMode, GoogleGenerativeAI } from "@google/generative-ai";
import { RootState } from "../../store";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { AiConfig } from '@/types/ai-config';
import { useAuth } from '@/hooks/useAuth';

interface AiState {
  messages: Array<{
    role: 'user' | 'model';
    parts: Array<{ text?: string; image?: { data: string; mimeType: string } }>;
    isSystemMessage?: boolean;
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
  let errorMessage = 'Đã xảy ra lỗi không xác định';

  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};

// Helper function to get active config by type
const getActiveConfigByType = (configs: AiConfig[] | null, type: string): AiConfig | undefined => {
  return configs?.find(c => c.type === type && c.is_active);
};

// Helper function to get API key from config
const getApiKey = (config: AiConfig | undefined): string => {

  if (!config) {
    throw new Error('Không tìm thấy cấu hình');
  }

  // Ưu tiên sử dụng global_api_key nếu có
  if (config.global_api_key) {
    return config.global_api_key;
  }

  // Nếu không có global_api_key, sử dụng api_key của config
  if (config.api_key) {
    return config.api_key;
  }

  throw new Error('Thiếu cấu hình API key');
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
      const systemConfig = getActiveConfigByType(state.ai.configs, 'system_prompt');

      // Nếu là system message, không cần hiển thị response
      if (isSystemMessage) {
        return {
          text: '',
          isSystemMessage: true,
          skipResponse: true
        };
      }

      const apiKey = getApiKey(systemConfig);
      const genAI = new GoogleGenerativeAI(apiKey);

      // Kiểm tra và xử lý function declarations
      let toolsConfig = undefined;
      if (systemConfig?.function_declarations) {
        // Parse function_declarations nếu nó là string
        const declarations = typeof systemConfig.function_declarations === 'string'
          ? JSON.parse(systemConfig.function_declarations)
          : systemConfig.function_declarations;

        if (Array.isArray(declarations)) {
          toolsConfig = [{
            functionDeclarations: declarations
          }];
        }
      }

      console.log('toolsConfig: ', toolsConfig);

      // Khởi tạo model với tools config
      const model = genAI.getGenerativeModel({
        model: systemConfig?.model_type || 'gemini-1.5-pro',
        systemInstruction: systemConfig?.context,
        tools: toolsConfig,
        toolConfig: toolsConfig ? { functionCallingConfig: { mode: "ANY" as FunctionCallingMode } } : undefined
      });

      const chat = model.startChat({
        history: state.ai.messages
          .filter((msg: any) => msg.parts[0]?.text?.trim() !== '')
          .map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.parts[0]?.text || '' }]
          })),
        generationConfig: {
          temperature: systemConfig?.temperature || 0.9,
          topK: systemConfig?.top_k || 40,
          topP: systemConfig?.top_p || 0.95,
          maxOutputTokens: systemConfig?.max_tokens || 8192,
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
      const visionConfig = getActiveConfigByType(state.ai.configs, 'vision_config');
      const generalConfig = getActiveConfigByType(state.ai.configs, 'general');
      const systemConfig = getActiveConfigByType(state.ai.configs, 'system_prompt');

      const activeConfig = visionConfig || generalConfig;
      const apiKey = getApiKey(activeConfig);

      // Initialize services
      const genAI = new GoogleGenerativeAI(apiKey);

      // Use gemini-1.5-pro for better vision capabilities
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: visionConfig?.context || systemConfig?.context
      });

      // Create prompt parts array
      const parts = [text, ...images.map(img => ({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType
        },
      })),
      ];

      const result = await model.generateContent(parts);
      const response = result.response;
      const responseText = response.text();

      if (!responseText) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      return responseText;
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
        parts: [{ text: action.payload }]
      });
    },
    removeTemporaryMessage: (state: AiState) => {
      if (state.messages.length > 0) {
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
        
        // Chỉ thêm response vào messages nếu không phải là system message
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
        if (state.messages.length > 0) {
          state.messages[state.messages.length - 1] = {
            role: 'model',
            parts: [{ text: action.payload }]
          };
        }
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