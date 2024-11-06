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

// Send text message to AI
export const sendTextMessage = createAsyncThunk(
  'ai/sendTextMessage',
  async ({ text }: { text: string }, { getState, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const systemConfig = getActiveConfigByType(state.ai.configs, 'system_prompt');
      const generalConfig = getActiveConfigByType(state.ai.configs, 'general');

      if (!generalConfig?.api_key) {
        throw new Error('Thiếu cấu hình API key');
      }

      const genAI = new GoogleGenerativeAI(generalConfig.api_key);

      // Validate model configuration
      if (!generalConfig.model_type) {
        throw new Error('Thiếu cấu hình model type');
      }

      const model = genAI.getGenerativeModel({
        model: generalConfig.model_type,
        generationConfig: {
          temperature: generalConfig.temperature || 0.9,
          topK: generalConfig.top_k || 40,
          topP: generalConfig.top_p || 1,
          maxOutputTokens: generalConfig.max_tokens || 2048,
          stopSequences: generalConfig.stop_sequences || []
        },
        safetySettings: generalConfig.safety_settings || []
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
        safetySettings: generalConfig.safety_settings
      });

      try {
        const result = await chat.sendMessage(text);
        const response = await result.response;
        const responseText = await response.text();

        if (!responseText) {
          throw new Error('Không nhận được phản hồi từ AI');
        }

        return responseText;
      } catch (chatError: any) {
        throw new Error(`Lỗi khi gửi tin nhắn: ${chatError.message}`);
      }
    } catch (error: any) {
      console.error("Send text error:", error);
      return rejectWithValue(error.message || 'Lỗi không xác định khi gửi tin nhắn');
    }
  }
);

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
      const systemConfig = getActiveConfigByType(state.ai.configs, 'system_prompt');
      const visionConfig = getActiveConfigByType(state.ai.configs, 'vision_config');
      const generalConfig = getActiveConfigByType(state.ai.configs, 'general');

      const activeConfig = visionConfig || generalConfig;
      if (!activeConfig?.api_key) {
        throw new Error('Thiếu cấu hình API key');
      }

      const genAI = new GoogleGenerativeAI(activeConfig.api_key);

      if (!activeConfig.model_type) {
        throw new Error('Thiếu cấu hình model type');
      }

      const model = genAI.getGenerativeModel({
        model: activeConfig.model_type,
        generationConfig: {
          temperature: activeConfig.temperature || 0.7,
          topK: activeConfig.top_k || 40,
          topP: activeConfig.top_p || 1,
          maxOutputTokens: activeConfig.max_tokens || 1024,
          stopSequences: activeConfig.stop_sequences || []
        },
        safetySettings: activeConfig.safety_settings || []
      });

      try {
        const result = await model.generateContent([
          { text },
          ...images.map(img => ({ inlineData: { data: img.data, mimeType: img.mimeType } }))
        ]);

        const response = await result.response;
        const responseText = await response.text();

        if (!responseText) {
          throw new Error('Không nhận được phản hồi từ AI');
        }

        return responseText;
      } catch (chatError: any) {
        throw new Error(`Lỗi khi xử lý hình ảnh: ${chatError.message}`);
      }
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

export const { clearMessages, clearError } = aiSlice.actions;
export default aiSlice.reducer;