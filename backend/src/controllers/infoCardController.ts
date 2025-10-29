import { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { ContentExtractor } from '../services/contentExtractor';
import { ExtractRequest, ExtractResponse } from '../types';

export class InfoCardController {
  private aiService: AIService;
  private contentExtractor: ContentExtractor;

  constructor() {
    this.aiService = new AIService();
    this.contentExtractor = new ContentExtractor();
  }

  extractInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, text, provider, style, color }: ExtractRequest = req.body;

      if (!url && !text) {
        const response: ExtractResponse = {
          success: false,
          error: '必须提供 URL 或文本内容'
        };
        res.status(400).json(response);
        return;
      }

      if (!provider || !provider.name) {
        const response: ExtractResponse = {
          success: false,
          error: '必须指定 AI 提供商'
        };
        res.status(400).json(response);
        return;
      }

      // 提取内容
      let content: string;
      if (url) {
        content = await this.contentExtractor.extractFromUrl(url);
      } else {
        content = await this.contentExtractor.extractFromDirectText(text || '');
      }

      if (!content || content.trim().length === 0) {
        const response: ExtractResponse = {
          success: false,
          error: '无法提取有效内容'
        };
        res.status(400).json(response);
        return;
      }

      // 使用 AI 提取关键信息
      const cardData = await this.aiService.extractKeyInfo(content, provider);

      const response: ExtractResponse = {
        success: true,
        data: {
          ...cardData,
          metadata: {
            ...(cardData.metadata || {}),
            source: url || 'text-input',
            extractedAt: new Date().toISOString(),
            provider: provider.name,
            style: style,
            color: color
          }
        }
      };

      res.json(response);
    } catch (error) {
      console.error('信息提取失败:', error);
      const response: ExtractResponse = {
        success: false,
        error: error instanceof Error ? error.message : '处理请求时发生错误'
      };
      res.status(500).json(response);
    }
  };

  getSupportedProviders = (req: Request, res: Response): void => {
    const providers = [ 
      {
        name: 'deepseek',
        displayName: 'DeepSeek',
        models: ['deepseek-chat', 'deepseek-reasoner'],
        required: ['apiKey'],
        description: 'DeepSeek AI 模型'
      },
      {
        name: 'zhipu',
        displayName: '智谱 AI',
        models: ['glm-4.6', 'glm-4.5', 'glm-4.5-air','glm-4.5-flash'],
        required: ['apiKey'],
        description: '智谱 GLM 模型'
      },
      {
        name: 'openai',
        displayName: 'OpenAI',
        models: ['gpt-4o', 'gpt-4'],
        required: ['apiKey'],
        description: 'OpenAI GPT 模型'
      },
      {
        name: 'azure',
        displayName: 'Azure OpenAI',
        models: ['gpt-35-turbo', 'gpt-4'],
        required: ['apiKey', 'endpoint'],
        description: 'Azure OpenAI 服务'
      },
      {
        name: 'gemini',
        displayName: 'Google Gemini',
        models: ['gemini-pro', 'gemini-pro-vision'],
        required: ['apiKey'],
        description: 'Google Gemini 模型'
      },
      {
        name: 'claude',
        displayName: 'Anthropic Claude',
        models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
        required: ['apiKey'],
        description: 'Anthropic Claude 模型'
      },
      {
        name: 'openrouter',
        displayName: 'OpenRouter',
        models: ['anthropic/claude-3-sonnet', 'openai/gpt-3.5-turbo'],
        required: ['apiKey'],
        description: 'OpenRouter 聚合服务'
      }
    ];

    res.json({ success: true, data: providers });
  };

  healthCheck = (req: Request, res: Response): void => {
    res.json({
      success: true,
      message: 'Info Card API is running',
      timestamp: new Date().toISOString()
    });
  };
}