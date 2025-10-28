import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';

// 常用的 User-Agent 字符串
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export class ContentExtractor {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }
  }

  async extractFromUrl(url: string): Promise<string> {
    try {
      // 首先尝试用简单的 HTTP 请求获取内容
      const textContent = await this.extractWithHttp(url);
      if (textContent && textContent.length > 100) {
        return textContent;
      }

      // 如果 HTTP 请求失败或内容太少，使用 Puppeteer
      return await this.extractWithPuppeteer(url);
    } catch (error) {
      console.error('URL 内容提取失败:', error);
      throw new Error(`提取 URL 内容失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  private async extractWithHttp(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': DEFAULT_USER_AGENT
        },
        timeout: 10000
      });

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('text/html')) {
        throw new Error('不是 HTML 内容');
      }

      return this.cleanHtmlContent(response.data);
    } catch (error) {
      console.warn('HTTP 提取失败，尝试使用 Puppeteer:', error);
      return '';
    }
  }

  private async extractWithPuppeteer(url: string): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    const page: Page = await this.browser!.newPage();

    try {
      // 设置用户代理
      await page.setUserAgent({
        userAgent: DEFAULT_USER_AGENT
      });

      // 设置视口
      await page.setViewport({ width: 1200, height: 800 });

      // 导航到页面，等待网络空闲
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 移除广告和不需要的元素
      await page.evaluate(() => {
        const selectorsToRemove = [
          'script',
          'style',
          'nav',
          'header',
          'footer',
          '.ad',
          '.advertisement',
          '.sidebar',
          '.menu',
          '.navigation',
          '.social-media',
          '.comments',
          '.popup',
          '.modal'
        ];

        selectorsToRemove.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
      });

      // 提取主要文本内容
      const content = await page.evaluate(() => {
        // 优先选择主要内容区域
        const contentSelectors = [
          'article',
          'main',
          '[role="main"]',
          '.content',
          '.article-content',
          '.post-content',
          '.entry-content',
          '#content',
          '#main-content'
        ];

        let mainContent = '';
        for (const selector of contentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            mainContent = element.textContent || '';
            if (mainContent.length > 200) {
              break;
            }
          }
        }

        // 如果没有找到主要内容，使用 body
        if (!mainContent || mainContent.length < 200) {
          mainContent = document.body?.textContent || '';
        }

        return mainContent;
      });

      return this.cleanTextContent(content);
    } finally {
      await page.close();
    }
  }

  private cleanHtmlContent(html: string): string {
    // 移除 HTML 标签和脚本
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return this.cleanTextContent(text);
  }

  private cleanTextContent(text: string): string {
    // 清理文本内容
    return text
      .replace(/\s+/g, ' ')  // 合并多个空格
      .replace(/\n\s*\n/g, '\n')  // 移除空行
      .replace(/^\s+|\s+$/g, '')  // 移除首尾空格
      .substring(0, 10000);  // 限制长度，避免内容过长
  }

  async extractFromDirectText(text: string): Promise<string> {
    // 处理直接输入的文本
    return this.cleanTextContent(text);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}