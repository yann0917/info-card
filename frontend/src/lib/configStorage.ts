import type { CardStyle, CardColor } from '@/types';

export interface AppConfig {
  selectedProvider: string;
  selectedModel: string;
  selectedStyle: CardStyle;
  selectedColor: CardColor;
}

const STORAGE_KEY = 'info-card-config';

export const configStorage = {
  // 保存配置到 localStorage
  saveConfig: (config: Partial<AppConfig>) => {
    try {
      const existingConfig = configStorage.getConfig();
      const newConfig = { ...existingConfig, ...config };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  },

  // 从 localStorage 读取配置
  getConfig: (): AppConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        return config;
      }
    } catch (error) {
      console.error('读取配置失败:', error);
    }

    // 返回默认配置
    return {
      selectedProvider: 'openai',
      selectedModel: 'gpt-4o',
      selectedStyle: {
        id: 'modern',
        name: '现代风格',
        description: '简洁现代的卡片设计，注重排版和留白'
      },
      selectedColor: {
        id: 'blue',
        name: '蓝色系',
        primary: '#3b82f6',
        secondary: '#60a5fa',
        accent: '#1d4ed8',
        background: '#eff6ff',
        text: '#1e3a8a',
        darkBackground: '#1e3a8a',
        darkText: '#dbeafe'
      }
    };
  },

  // 清除配置
  clearConfig: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('清除配置失败:', error);
    }
  }
};