// constants/errorMessages.ts
export const ERROR_KEYS = {
    CONFIG_NOT_FOUND: 'error.config_not_found',
    MISSING_API_KEY: 'error.missing_api_key',
    UNDEFINED_ERROR: 'error.undefined_error',
    NO_ACTIVE_CONFIG: 'error.no_active_config',
    INIT_CHAT_ERROR: 'error.init_chat_error',
    SEND_MESSAGE_ERROR: 'error.send_message_error',
    FETCH_CONFIG_ERROR: 'error.fetch_config_error',
    FUNCTION_CALL_ERROR: 'error.function_call_error',
    FUNCTION_CALL_ERROR_MESSAGE: 'error.function_call_error_message',
    IMAGE_SEND_ERROR: 'error.image_send_error',
    IMAGE_SEND_ERROR_MESSAGE: 'error.image_send_error_message',
    CHECKING_INFORMATION: 'chat.checking_information',
} as const;