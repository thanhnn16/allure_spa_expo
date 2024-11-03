import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchChatsThunk } from './fetchChatsThunk';
import { fetchMessagesThunk } from './fetchMessagesThunk';
import { sendMessageThunk } from './sendMessageThunk';
import { markAsReadThunk } from './markAsReadThunk';

interface ChatMessage {
    id: string;
    chat_id: string;
    sender_id: string;
    message: string;
    created_at: string;
    sender?: {
        id: string;
        name: string;
    };
}

interface Chat {
    id: string;
    user_id: string;
    staff_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    messages: ChatMessage[];
    user?: {
        id: string;
        name: string;
    };
    staff?: {
        id: string;
        name: string;
    };
}

interface ChatState {
    chats: Chat[];
    currentChat: Chat | null;
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chats: [],
    currentChat: null,
    messages: [],
    isLoading: false,
    error: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateChatLastMessage: (state, action: PayloadAction<{ chatId: string; message: ChatMessage }>) => {
            const { chatId, message } = action.payload;
            const chatIndex = state.chats.findIndex(chat => chat.id === chatId);

            if (chatIndex !== -1) {
                // Nếu chat chưa có mảng messages, tạo mới
                if (!state.chats[chatIndex].messages) {
                    state.chats[chatIndex].messages = [];
                }

                // Thêm tin nhắn mới vào đầu mảng
                state.chats[chatIndex].messages.unshift(message);

                // Giới hạn số lượng tin nhắn lưu trong danh sách (ví dụ: chỉ giữ 1 tin nhắn gần nhất)
                if (state.chats[chatIndex].messages.length > 1) {
                    state.chats[chatIndex].messages = state.chats[chatIndex].messages.slice(0, 1);
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch Chats
        builder
            .addCase(fetchChatsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChatsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats = action.payload.map((chat: Chat) => ({
                    ...chat,
                    messages: chat.messages || []
                }));
                state.error = null;
            })
            .addCase(fetchChatsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Messages
        builder
            .addCase(fetchMessagesThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload;
                state.error = null;
            })
            .addCase(fetchMessagesThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Send Message
        builder
            .addCase(sendMessageThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendMessageThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages.push(action.payload);
                state.error = null;
            })
            .addCase(sendMessageThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Mark as Read
        builder
            .addCase(markAsReadThunk.fulfilled, (state) => {
                state.messages = state.messages.map(msg => ({
                    ...msg,
                    is_read: true
                }));
            });
    },
});

export const { addMessage, updateChatLastMessage } = chatSlice.actions;
export default chatSlice.reducer; 