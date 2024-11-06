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
  error: string | null;
  configs: AiConfig[] | null;
}

const initialState: AiState = {
  messages: [],
  isLoading: false,
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

// Send text message to AI
export const sendTextMessage = createAsyncThunk(
  'ai/sendTextMessage',
  async ({ text }: { text: string }, { getState, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const generalConfig = state.ai.configs?.find(
        (c: AiConfig) => c.is_active
      );

      if (!generalConfig) {
        throw new Error('General configuration not found');
      }

      const genAI = new GoogleGenerativeAI(generalConfig.api_key);
      const model = genAI.getGenerativeModel({
        model: generalConfig.model_type || "gemini-1.0-pro",
        systemInstruction:
          generalConfig.context ||
          "Always answer that you are Allure SPA, and waiting for training session to support customer. Please come back later.",
      });

      // Format chat history correctly
      const history = state.ai.messages.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.parts[0]?.text || "" }]
      })).filter((msg: any) => msg.parts[0].text !== "");

      // Create chat
      const chat = model.startChat({
        history: history.length > 0 ? history : undefined,
        generationConfig: {
          temperature: generalConfig.temperature || 0.7,
          topK: generalConfig.top_k || 40,
          topP: generalConfig.top_p || 0.95,
          maxOutputTokens: generalConfig.max_tokens || 1024,
        }
      });

      // Send message
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
      const generalConfig = state.ai.configs?.find(
        (c: AiConfig) => c.type === 'general' && c.is_active
      );
      const visionConfig = state.ai.configs?.find(
        (c: AiConfig) => c.type === 'vision_config' && c.is_active
      );

      // Check for API key in config
      const apiKey = generalConfig?.api_key || visionConfig?.api_key;
      if (!apiKey) {
        throw new Error('Missing API key configuration');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: visionConfig?.model_type || generalConfig.model_type,
        systemInstruction:
          visionConfig?.context ||
          generalConfig.context ||
          "Always answer that you are Allure SPA, and waiting for training session to support customer. Please come back later.",
      });

      // Create chat with history
      const chat = model.startChat({
        history: state.ai.messages.map((msg: any) => ({
          role: msg.role,
          parts: msg.parts.map((part: any) => {
            if (part.text) return part.text;
            if (part.image) return `[Image uploaded]`;
            return "";
          }).filter(Boolean)
        })),
        generationConfig: {
          temperature: visionConfig?.temperature || generalConfig.temperature,
          topK: visionConfig?.top_k || generalConfig.top_k,
          topP: visionConfig?.top_p || generalConfig.top_p,
          maxOutputTokens: visionConfig?.max_tokens || generalConfig.max_tokens,
        }
      });

      const prompt = {
        contents: [
          visionConfig && {
            role: 'user',
            parts: [{ text: visionConfig.context }]
          },
          {
            role: 'user',
            parts: [
              { text },
              ...images.map(img => ({ image: img }))
            ]
          }
        ].filter(Boolean)
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
        state.error = action.payload as string;
      })

      // Send text message
      .addCase(sendTextMessage.pending, (state: AiState) => {
        state.isLoading = true;
      })
      .addCase(sendTextMessage.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.messages.push(
          { role: 'user', parts: [{ text: action.meta.arg.text }] },
          { role: 'model', parts: [{ text: action.payload }] }
        );
      })
      .addCase(sendTextMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Send image message  
      .addCase(sendImageMessage.pending, (state: AiState) => {
        state.isLoading = true;
      })
      .addCase(sendImageMessage.fulfilled, (state: AiState, action: any) => {
        state.isLoading = false;
        state.messages.push(
          {
            role: 'user',
            parts: [
              { text: action.meta.arg.text },
              ...action.meta.arg.images.map((img: any) => ({ image: img }))
            ]
          },
          { role: 'model', parts: [{ text: action.payload }] }
        );
      })
      .addCase(sendImageMessage.rejected, (state: AiState, action: any) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearMessages, clearError } = aiSlice.actions;
export default aiSlice.reducer; 