import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RootState } from "../../store";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { AiConfig } from '@/types/ai-config';

interface AiState {
  messages: Array<{
    role: 'user' | 'model';
    parts: Array<{ text?: string; image?: { data: string; mimeType: string } }>;
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
const getApiKey = (config: AiConfig | undefined, configs: AiConfig[] | null): string => {
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

// Send text message to AI
export const sendTextMessage = createAsyncThunk(
  'ai/sendTextMessage',
  async ({ text }: { text: string }, { getState, dispatch, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const systemConfig = getActiveConfigByType(state.ai.configs, 'system_prompt');
      const generalConfig = getActiveConfigByType(state.ai.configs, 'general');

      const apiKey = getApiKey(generalConfig, state.ai.configs);
      const genAI = new GoogleGenerativeAI(apiKey);

      if (!generalConfig?.model_type) {
        throw new Error('Thiếu cấu hình model type');
      }

      const model = genAI.getGenerativeModel({
        model: generalConfig.model_type,
        systemInstruction: systemConfig?.context,
      });

      const chat = model.startChat({
        history: state.ai.messages
          .filter((msg: any) => msg.parts[0]?.text)
          .map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.parts[0].text || "" }]
          })),
        generationConfig: {
          temperature: generalConfig.temperature,
          topK: generalConfig.top_k,
          topP: generalConfig.top_p,
          maxOutputTokens: generalConfig.max_tokens,
          stopSequences: generalConfig.stop_sequences
        },
        safetySettings: generalConfig.safety_settings,
        tools: [{
          functionDeclarations: generalConfig.function_declarations
        }]
      });

      const result = await chat.sendMessage(text);
      const response = result.response;
      
      // Kiểm tra function call
      if (response.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
        const functionCall = response.candidates[0].content.parts[0].functionCall;
        
        // Thêm tin nhắn tạm thời
        dispatch(addTemporaryMessage("Để tôi kiểm tra thông tin cho bạn..."));
        
        try {
          // Gọi API function
          const functionResult = await handleFunctionCall(
            functionCall.name, 
            functionCall.args
          );
          
          // Gửi kết quả function call lại cho AI
          const followUpResult = await chat.sendMessage(
            JSON.stringify({
              success: true,
              data: functionResult.data
            })
          );

          // Xóa tin nhắn tạm thời
          dispatch(removeTemporaryMessage());
          return followUpResult.response.text();
          
        } catch (error) {
          dispatch(removeTemporaryMessage());
          throw new Error('Không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau.');
        }
      }

      return response.text();
    } catch (error: any) {
      console.error("Send text error:", error);
      return rejectWithValue(error.message || 'Lỗi không xác định khi gửi tin nhắn');
    }
  }
);

// Thêm hàm xử lý function call
const handleFunctionCall = async (functionName: string, args: any) => {
  try {
    const response = await AxiosInstance().post('/ai/function-call', {
      function: functionName,
      args: args
    });
    return response.data;
  } catch (error) {
    console.error('Function call error:', error);
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
      const apiKey = getApiKey(activeConfig, state.ai.configs);

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
          state.messages.push(
            { role: 'user', parts: [{ text: action.meta.arg.text }] },
            { role: 'model', parts: [{ text: '...' }] }
          );
        }
      })
      .addCase(sendTextMessage.fulfilled, (state: AiState, action: any) => {
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
      .addCase(sendTextMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = action.payload as string;
        // Remove the last message if it was a loading message
        if (state.messages.length > 0 && state.messages[state.messages.length - 1].parts[0].text === '...') {
          state.messages.pop();
        }
      })

      // Send image message
      .addCase(sendImageMessage.pending, (state: AiState, action: any) => {
        state.isLoading = true;
        state.isThinking = true;
        state.error = null;
        state.messages.push(
          {
            role: 'user',
            parts: [
              { text: action.meta.arg.text },
              ...action.meta.arg.images.map((img: any) => ({ image: img }))
            ]
          },
          { role: 'model', parts: [{ text: '...' }] }
        );
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
        if (state.messages.length > 0 && state.messages[state.messages.length - 1].parts[0].text === '...') {
          state.messages.pop();
        }
      });
  }
});

export const {
  clearMessages,
  clearError,
  addTemporaryMessage,
  removeTemporaryMessage
} = aiSlice.actions;
export default aiSlice.reducer;