export interface SystemPrompt {
  ai_name: string;
  type: 'system_prompt';
  context: string;
  language: string;
  model_type: string;
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  is_active: boolean;
  priority: number;
  version?: string;
  metadata?: any;
}

export interface VisionPrompt {
  ai_name: string;
  type: 'vision_config';
  context: string;
  language: string;
  model_type: string;
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  is_active: boolean;
  priority: number;
  version?: string;
  gemini_settings?: {
    vision_parameters?: {
      max_output_tokens?: number;
      temperature?: number;
    }
  };
  metadata?: any;
}

export interface GeneralSettings {
  ai_name: string;
  type: 'general';
  context: string;
  language: string;
  model_type: string;
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  is_active: boolean;
  priority: number;
  version?: string;
  gemini_settings?: any;
  metadata?: any;
}

export interface AiConfig {
  id: number;
  ai_name: string;
  type: 'system_prompt' | 'vision_config' | 'general';
  context: string;
  api_key: string;
  language: string;
  gemini_settings?: any;
  is_active: boolean;
  priority: number;
  version?: string;
  model_type: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
  metadata?: any;
  safety_settings?: any[];
  function_declarations?: any[];
  tool_config?: any;
  system_instructions?: string;
  response_format?: string;
  stop_sequences?: string[];
} 