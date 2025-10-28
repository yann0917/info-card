import OpenAI from 'openai';
import axios from 'axios';
import { AIProvider, CardData, SupportedProvider, ProviderConfig } from '../types';

export class AIService {
  private providerConfigs: ProviderConfig = {
    openai: {
      defaultModel: 'gpt-3.5-turbo'
    },
    deepseek: {
      defaultModel: 'deepseek-chat',
      baseURL: 'https://api.deepseek.com/v1'
    },
    azure: {
      defaultModel: 'gpt-35-turbo',
      baseURL: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: '2024-02-15-preview'
    },
    gemini: {
      defaultModel: 'gemini-pro',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta'
    },
    claude: {
      defaultModel: 'claude-3-sonnet-20240229',
      baseURL: 'https://api.anthropic.com'
    },
    openrouter: {
      defaultModel: 'anthropic/claude-3-sonnet',
      baseURL: 'https://openrouter.ai/api/v1'
    },
    zhipu: {
      defaultModel: 'glm-4',
      baseURL: 'https://open.bigmodel.cn/api/paas/v4'
    }
  };

  async extractKeyInfo(content: string, provider: AIProvider): Promise<CardData> {
    const providerType = provider.name.toLowerCase() as SupportedProvider;
    const config = this.providerConfigs[providerType];

    if (!config) {
      throw new Error(`不支持的 AI 提供商: ${provider.name}`);
    }

    const prompt = `请从以下内容中提取关键信息，生成一张信息卡片。返回 JSON 格式，包含以下字段：
- title: 标题
- description: 简短描述（不超过200字）
- keyPoints: 关键要点数组（3-5个要点）
- tags: 标签数组（3-5个标签）

内容：
${content}

请确保返回有效的 JSON 格式。`;

    try {
      let response;

      switch (providerType) {
        case 'openai':
          response = await this.callOpenAI(prompt, provider);
          break;
        case 'deepseek':
          response = await this.callDeepSeek(prompt, provider);
          break;
        case 'azure':
          response = await this.callAzureOpenAI(prompt, provider);
          break;
        case 'gemini':
          response = await this.callGemini(prompt, provider);
          break;
        case 'claude':
          response = await this.callClaude(prompt, provider);
          break;
        case 'openrouter':
          response = await this.callOpenRouter(prompt, provider);
          break;
        case 'zhipu':
          response = await this.callZhipu(prompt, provider);
          break;
        default:
          throw new Error(`未实现的提供商: ${providerType}`);
      }

      return response;
    } catch (error) {
      console.error('AI 服务调用失败:', error);
      throw new Error(`AI 服务调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  private async callOpenAI(prompt: string, provider: AIProvider): Promise<CardData> {
    const openai = new OpenAI({
      apiKey: provider.apiKey || process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: provider.model || this.providerConfigs.openai.defaultModel,
      messages: [
        {
          role: "system",
          content: "你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private async callDeepSeek(prompt: string, provider: AIProvider): Promise<CardData> {
    const response = await axios.post(
      `${this.providerConfigs.deepseek.baseURL}/chat/completions`,
      {
        model: provider.model || this.providerConfigs.deepseek.defaultModel,
        messages: [
          {
            role: "system",
            content: "你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey || process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('DeepSeek 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private async callAzureOpenAI(prompt: string, provider: AIProvider): Promise<CardData> {
    const azureEndpoint = provider.baseURL || process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = provider.apiKey || process.env.AZURE_OPENAI_API_KEY;
    const apiVersion = this.providerConfigs.azure.apiVersion;

    const response = await axios.post(
      `${azureEndpoint}/openai/deployments/${provider.model || this.providerConfigs.azure.defaultModel}/chat/completions?api-version=${apiVersion}`,
      {
        messages: [
          {
            role: "system",
            content: "你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Azure OpenAI 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private async callGemini(prompt: string, provider: AIProvider): Promise<CardData> {
    const apiKey = provider.apiKey || process.env.GEMINI_API_KEY;
    const model = provider.model || this.providerConfigs.gemini.defaultModel;

    const response = await axios.post(
      `${this.providerConfigs.gemini.baseURL}/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.candidates[0]?.content?.parts[0]?.text;
    if (!content) {
      throw new Error('Gemini 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private async callClaude(prompt: string, provider: AIProvider): Promise<CardData> {
    const response = await axios.post(
      `${this.providerConfigs.claude.baseURL}/v1/messages`,
      {
        model: provider.model || this.providerConfigs.claude.defaultModel,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。\n\n${prompt}`
          }
        ]
      },
      {
        headers: {
          'x-api-key': provider.apiKey || process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.content[0]?.text;
    if (!content) {
      throw new Error('Claude 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private async callOpenRouter(prompt: string, provider: AIProvider): Promise<CardData> {
    const response = await axios.post(
      `${this.providerConfigs.openrouter.baseURL}/chat/completions`,
      {
        model: provider.model || this.providerConfigs.openrouter.defaultModel,
        messages: [
          {
            role: "system",
            content: "你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey || process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://info-card.local',
          'X-Title': 'Info Card Generator'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private async callZhipu(prompt: string, provider: AIProvider): Promise<CardData> {
    const response = await axios.post(
      `${this.providerConfigs.zhipu.baseURL}/chat/completions`,
      {
        model: provider.model || this.providerConfigs.zhipu.defaultModel,
        messages: [
          {
            role: "system",
            content: "你是一个专业的信息提取助手，擅长从文本中提取关键信息并生成结构化的卡片数据。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey || process.env.ZHIPU_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('智谱 AI 返回空响应');
    }

    return this.parseJSONResponse(content);
  }

  private parseJSONResponse(content: string): CardData {
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('响应中未找到有效的 JSON');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // 验证必需字段
      if (!parsed.title || !parsed.description || !Array.isArray(parsed.keyPoints) || !Array.isArray(parsed.tags)) {
        throw new Error('JSON 响应缺少必需字段');
      }

      return {
        title: parsed.title,
        description: parsed.description,
        keyPoints: parsed.keyPoints,
        tags: parsed.tags,
        metadata: parsed.metadata
      };
    } catch (error) {
      console.error('解析 JSON 响应失败:', content, error);
      throw new Error(`解析 AI 响应失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}