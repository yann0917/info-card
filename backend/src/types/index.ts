export interface AIProvider {
  name: string;
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

export interface ExtractRequest {
  url?: string;
  text?: string;
  provider: AIProvider;
  style?: CardStyle;
  color?: CardColor;
}

export interface ExtractResponse {
  success: boolean;
  data?: CardData;
  error?: string;
}

export interface CardData {
  title: string;
  description: string;
  keyPoints: string[];
  tags: string[];
  metadata?: Record<string, any>;
}

export interface CardStyle {
  id: string;
  name: string;
  description: string;
}

export interface CardColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export type SupportedProvider = 'openai' | 'deepseek' | 'azure' | 'gemini' | 'claude' | 'openrouter' | 'zhipu';

export interface ProviderConfig {
  [key: string]: {
    defaultModel: string;
    baseURL?: string;
    apiVersion?: string;
  };
}