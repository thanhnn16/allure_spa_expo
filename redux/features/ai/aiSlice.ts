import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FunctionCallingMode, GoogleGenerativeAI } from "@google/generative-ai";
import { RootState } from "../../store";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { AiConfig } from '@/types/ai-config';
import {
  handleFunctionCall,
  getActiveConfig,
  handleApiError,
  FunctionCallResponse,
  CandidateResponse,
  AiMessage
} from './aiFunctions';

interface AiState {
  messages: Array<{
    role: 'user' | 'model';
    parts: Array<{ text?: string; image?: { data: string; mimeType: string } }>;
    isSystemMessage?: boolean;
    isTemporary?: boolean;
    actionButton?: {
      type: 'addToCart' | 'seeCart' | 'seeProductDetail' | 'seeServiceDetail';
      params?: any;
    };
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
  async (
    {
      text,
      isSystemMessage = false
    }: {
      text: string;
      isSystemMessage?: boolean
    },
    thunkAPI: any
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
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
          temperature: config?.temperature || 0.9,
          topK: config?.top_k || 40,
          topP: config?.top_p || 0.95,
          maxOutputTokens: config?.max_tokens || 8192,
        },
      });

      const result = await chat.sendMessage(text.trim());
      const response = result.response;

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts || parts.length === 0) {
        throw new Error('Invalid response format');
      }

      let responseText = '';
      if (parts[0]?.text) {
        responseText = parts[0].text;
      }

      const functionCallPart = parts.find(part => part.functionCall);
      if (functionCallPart?.functionCall) {
        try {
          const functionResult = await handleFunctionCall(
            functionCallPart.functionCall.name,
            functionCallPart.functionCall.args || {},
            thunkAPI.dispatch,
            state.auth.user
          );

          let actionButton = null;
          if (functionCallPart.functionCall.name === 'addToCart') {
            actionButton = {
              type: 'addToCart',
              params: {
                product_id: functionResult.data.product?.id,
                ...functionResult.data.product
              }
            };
          } else if (functionCallPart.functionCall.name === 'seeCart') {
            actionButton = {
              type: 'seeCart'
            };
          } else if (functionCallPart.functionCall.name === 'seeProductDetail') {
            actionButton = {
              type: 'seeProductDetail',
              params: {
                id: functionResult.data.id
              }
            };
          } else if (functionCallPart.functionCall.name === 'seeServiceDetail') {
            actionButton = {
              type: 'seeServiceDetail',
              params: {
                id: functionResult.data.id
              }
            };
          }

          const followUpResult = await chat.sendMessage(
            JSON.stringify(functionResult)
          );

          const finalResponse = followUpResult.response.text();
          if (finalResponse && finalResponse.trim() !== '') {
            responseText += '\n' + finalResponse;
          }

          return {
            text: responseText,
            actionButton
          };

        } catch (error) {
          console.error('Function call processing error:', error);
          responseText += '\nXin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.';
          return { text: responseText };
        }
      }

      return { text: responseText };

    } catch (error: any) {
      console.error("Send text error:", error);
      return thunkAPI.rejectWithValue(error.message || 'Lỗi không xác định khi gửi tin nhắn');
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
  }, { getState, rejectWithValue, dispatch }: any) => {
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
            functionCallPart.functionCall.args || {},
            dispatch,
            getState().auth.user
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
    },
    logChatHistory: (state: AiState) => {
      const chatHistory = state.messages.map(msg => ({
        role: msg.role,
        content: msg.parts[0]?.text || '',
        isSystemMessage: msg.isSystemMessage || false,
        hasImage: msg.parts.some(part => part.image),
        actionButton: msg.actionButton
      }));
      
      console.log('Chat History:', JSON.stringify(chatHistory, null, 2));
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
            parts: [{ text: action.payload.text }],
            actionButton: action.payload.actionButton
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
  updateLastMessage,
  logChatHistory
} = aiSlice.actions;

export default aiSlice.reducer;