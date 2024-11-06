import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GenerateContentRequest, GoogleGenerativeAI } from '@google/generative-ai';
import { RootState } from '../../store';
import axios from 'axios';
import { AiConfig } from '@/types/ai-config';
import type { SystemPrompt, VisionPrompt, GeneralSettings } from '@/types/ai-config';

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
      const response = await axios.get('/api/ai-config');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch AI configs');
    }
  }
);

const getModelConfig = (config: AiConfig) => {
  return {
    temperature: config?.temperature || 0.9,
    topK: config?.top_k || 40,
    topP: config?.top_p || 1,
    maxOutputTokens: config?.max_tokens || 2048,
  };
};

// Send text message to AI
export const sendTextMessage = createAsyncThunk(
  'ai/sendTextMessage',
  async ({ text }: { text: string }, { getState, rejectWithValue }: any) => {
    try {
      const state = getState() as RootState;
      const generalConfig = state.ai.configs?.find(
        (c: AiConfig) => c.type === 'general' && c.is_active
      );
      const systemPrompt = state.ai.configs?.find(
        (c: AiConfig) => c.type === 'system_prompt' && c.is_active
      );
      
      // Check for API key in config
      const apiKey = generalConfig?.api_key;
      if (!apiKey) {
        throw new Error('Missing API key configuration');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: generalConfig.model_type,
        generationConfig: {
          temperature: generalConfig.temperature,
          topK: generalConfig.top_k,
          topP: generalConfig.top_p,
          maxOutputTokens: generalConfig.max_tokens,
        }
      });

      const chat = model.startChat({
        history: state.ai.messages,
        generationConfig: {
          temperature: generalConfig.temperature,
          topK: generalConfig.top_k,
          topP: generalConfig.top_p,
          maxOutputTokens: generalConfig.max_tokens,
        }
      });

      if (systemPrompt?.context) {
        await chat.sendMessage(systemPrompt.context);
      }

      const result = await chat.sendMessage(text);
      return result.response.text();
    } catch (error: any) {
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

      const result = await model.generateContent(prompt as GenerateContentRequest);
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