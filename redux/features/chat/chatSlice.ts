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
    sending?: boolean;
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
    isSending: boolean;
}

const initialState: ChatState = {
    chats: [],
    currentChat: null,
    messages: [],
    isLoading: false,
    error: null,
    isSending: false,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state: ChatState, action: any) => {
            // Kiểm tra tin nhắn trùng lặp trước khi thêm vào
            const isDuplicate = state.messages.some(
                msg => msg.id === action.payload.id
            );
            if (!isDuplicate) {
                state.messages.unshift(action.payload);
            }
        },
        updateChatLastMessage: (state: ChatState, action: any) => {
            const { chatId, message } = action.payload;
            const chatIndex = state.chats.findIndex((chat: Chat) => chat.id === chatId);

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
        addTempMessage: (state: ChatState, action: any) => {
            state.messages.unshift({
                ...action.payload,
                sending: true
            });
        },
    },
    extraReducers: (builder: any) => {
        // Fetch Chats
        builder
            .addCase(fetchChatsThunk.pending, (state: ChatState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChatsThunk.fulfilled, (state: ChatState, action: any) => {
                state.isLoading = false;
                state.chats = action.payload.map((chat: Chat) => ({
                    ...chat,
                    messages: chat.messages || []
                }));
                state.error = null;
            })
            .addCase(fetchChatsThunk.rejected, (state: ChatState, action: any) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Messages
        builder
            .addCase(fetchMessagesThunk.pending, (state: ChatState) => {
                state.isLoading = true;
            })
            .addCase(fetchMessagesThunk.fulfilled, (state: ChatState, action: any) => {
                state.isLoading = false;
                if (action.meta.arg.page === 1) {
                    // First page - replace all messages
                    state.messages = action.payload.messages;
                } else {
                    // Subsequent pages - add older messages to the end
                    state.messages = [...state.messages, ...action.payload.messages];
                }
                state.error = null;
            })
            .addCase(fetchMessagesThunk.rejected, (state: ChatState, action: any) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Send Message
        builder
            .addCase(sendMessageThunk.pending, (state: ChatState) => {
                state.isSending = true;
            })
            .addCase(sendMessageThunk.fulfilled, (state: ChatState, action: any) => {
                state.isSending = false;
                // Replace temp message with actual message
                const messageIndex = state.messages.findIndex(
                    msg => msg.id === action.meta.arg.tempId
                );
                if (messageIndex !== -1) {
                    state.messages[messageIndex] = {
                        ...action.payload,
                        sending: false
                    };
                }
                state.error = null;
            })
            .addCase(sendMessageThunk.rejected, (state: ChatState, action: any) => {
                state.isSending = false;
                // Update message status on error
                const messageIndex = state.messages.findIndex(
                    msg => msg.id === action.meta?.arg.tempId
                );
                if (messageIndex !== -1) {
                    state.messages[messageIndex].sending = false;
                }
                state.error = action.payload as string;
            });

        // Mark as Read
        builder
            .addCase(markAsReadThunk.fulfilled, (state: ChatState) => {
                state.messages = state.messages.map((msg: ChatMessage) => ({
                    ...msg,
                    is_read: true
                }));
            });
    },
});

export const { addMessage, updateChatLastMessage, addTempMessage } = chatSlice.actions;
export default chatSlice.reducer; 