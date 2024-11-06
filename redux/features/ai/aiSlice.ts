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

// Fetch AI configs from server
export const fetchAiConfigs = createAsyncThunk(
  'ai/fetchConfigs',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await AxiosInstance().get('/ai-config');
      return response.data.data;
    } catch (error: any) {
      console.log(`Failed to fetch AI configs: ${error.response?.data.message}`);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch AI configs');
    }
  }
);

// Helper function to get active config by type
const getActiveConfigByType = (configs: AiConfig[] | null, type: string): AiConfig | undefined => {
  return configs?.find(c => c.type === type && c.is_active);
};

// Send text message to AI
export const sendTextMessage = createAsyncThunk(
  'ai/sendTextMessage',
  async ({ text }: { text: string }, { getState, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const systemConfig = getActiveConfigByType(state.ai.configs, 'system_prompt');
      const generalConfig = getActiveConfigByType(state.ai.configs, 'general');

      if (!generalConfig?.api_key) {
        throw new Error('Missing API key configuration');
      }

      const genAI = new GoogleGenerativeAI(generalConfig.api_key);
      const model = genAI.getGenerativeModel({
        model: generalConfig.model_type,
        systemInstruction: systemConfig?.context || generalConfig.context
      });

      const history = state.ai.messages.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.parts[0]?.text || "" }]
      })).filter((msg: any) => msg.parts[0].text !== "");

      const chat = model.startChat({
        history: history.length > 0 ? history : undefined,
        generationConfig: {
          temperature: generalConfig.temperature,
          topK: generalConfig.top_k,
          topP: generalConfig.top_p,
          maxOutputTokens: generalConfig.max_tokens,
          stopSequences: generalConfig.stop_sequences
        },
        safetySettings: generalConfig.safety_settings
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Send text error:", error);
      return rejectWithValue(error.message);
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
        throw new Error('Missing API key configuration');
      }

      const genAI = new GoogleGenerativeAI(activeConfig.api_key);
      const model = genAI.getGenerativeModel({
        model: activeConfig.model_type,
        systemInstruction: systemConfig?.context || activeConfig.context
      });

      const chat = model.startChat({
        history: state.ai.messages.map((msg: any) => ({
          role: msg.role,
          parts: msg.parts.map((part: any) => {
            if (part.text) return { text: part.text };
            if (part.image) return { image: part.image };
            return { text: "" };
          })
        })),
        generationConfig: {
          temperature: activeConfig.temperature,
          topK: activeConfig.top_k,
          topP: activeConfig.top_p,
          maxOutputTokens: activeConfig.max_tokens,
          stopSequences: activeConfig.stop_sequences
        },
        safetySettings: activeConfig.safety_settings
      });

      const prompt = {
        contents: [
          {
            role: 'user',
            parts: [
              { text },
              ...images.map(img => ({ image: img }))
            ]
          }
        ]
      };

      const result = await chat.sendMessage(prompt as any);
      return result.response.text();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearMessages: (state: AiState) => {
      state.messages = [];
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
      })
      .addCase(fetchAiConfigs.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.configs = action.payload;
      })
      .addCase(fetchAiConfigs.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Send text message
      .addCase(sendTextMessage.pending, (state: AiState, action: any) => {
        state.isLoading = true;
        state.isThinking = true;
        state.messages.push(
          { role: 'user', parts: [{ text: action.payload.text }] },
          { role: 'model', parts: [{ text: '...' }] }
        );
      })
      .addCase(sendTextMessage.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.messages[state.messages.length - 1] = {
          role: 'model',
          parts: [{ text: action.payload }]
        };
      })
      .addCase(sendTextMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = action.payload;
        state.messages.pop();
      })

      // Send image message  
      .addCase(sendImageMessage.pending, (state: AiState, action: any) => {
        state.isLoading = true;
        state.isThinking = true;
        state.messages.push(
          {
            role: 'user',
            parts: [
              { text: action.payload.text },
              ...action.payload.images.map((img: any) => ({ image: img }))
            ]
          },
          { role: 'model', parts: [{ text: '...' }] }
        );
      })
      .addCase(sendImageMessage.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.messages[state.messages.length - 1] = {
          role: 'model',
          parts: [{ text: action.payload }]
        };
      })
      .addCase(sendImageMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.isThinking = false;
        state.error = action.payload;
        state.messages.pop();
      });
  }
});

export const { clearMessages, clearError } = aiSlice.actions;
export default aiSlice.reducer; 