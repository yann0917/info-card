import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas-pro';

interface SimpleStyledDownloadProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  cardData: any;
  fileName?: string;
}

export const SimpleStyledDownload: React.FC<SimpleStyledDownloadProps> = ({
  cardRef,
  cardData,
  fileName = 'info-card'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('800x600');

  const getDimensions = (ratio: string) => {
    const [width, height] = ratio.split('x').map(Number);
    return { width, height };
  };

  // 根据目标尺寸获取排版配置
  const getLayoutConfig = (width: number, height: number) => {
    const aspectRatio = width / height;

    // 横版布局
    if (aspectRatio > 1.2) {
      return {
        titleSize: 'text-2xl',
        descriptionSize: 'text-base',
        keyPointsSize: 'text-sm',
        tagSize: 'text-xs',
        spacing: 'space-y-4',
        padding: 'p-6',
        compact: false
      };
    }

    // 竖版布局
    if (aspectRatio < 0.8) {
      return {
        titleSize: 'text-xl',
        descriptionSize: 'text-sm',
        keyPointsSize: 'text-xs',
        tagSize: 'text-xs',
        spacing: 'space-y-3',
        padding: 'p-4',
        compact: true
      };
    }

    // 正方形或接近正方形
    return {
      titleSize: 'text-xl',
      descriptionSize: 'text-sm',
      keyPointsSize: 'text-xs',
      tagSize: 'text-xs',
      spacing: 'space-y-3',
      padding: 'p-5',
      compact: false
    };
  };

  // 应用排版样式到元素
  const applyLayoutStyles = (element: HTMLElement | null, config: any) => {
    if (!element) return;

    // 应用容器样式
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.overflow = 'hidden';

    // 应用内边距
    const paddingMap: Record<string, string> = {
      'p-4': '16px',
      'p-5': '20px',
      'p-6': '24px'
    };
    element.style.padding = paddingMap[config.padding] || '20px';
    element.style.boxSizing = 'border-box';

    // 查找并设置各部分的样式
    const title = element.querySelector('h3, h2, [class*="title"]') as HTMLElement;
    if (title) {
      const fontSizeMap: Record<string, string> = {
        'text-xl': '20px',
        'text-2xl': '24px'
      };
      title.style.fontSize = fontSizeMap[config.titleSize] || '20px';
      title.style.lineHeight = '1.4';
      title.style.marginBottom = config.compact ? '8px' : '12px';
    }

    const description = element.querySelector('p') as HTMLElement;
    if (description) {
      const fontSizeMap: Record<string, string> = {
        'text-sm': '14px',
        'text-base': '16px'
      };
      description.style.fontSize = fontSizeMap[config.descriptionSize] || '14px';
      description.style.lineHeight = '1.5';
      description.style.marginBottom = config.compact ? '12px' : '16px';
    }

    // 设置关键要点区域样式 - 使用专用class
    const keyPointsSection = element.querySelector('.key-points-section') as HTMLElement;
    if (keyPointsSection) {
      keyPointsSection.style.marginBottom = config.compact ? '12px' : '16px';
    }

    // 设置关键要点标题样式 - 使用专用class
    const keyPointsTitle = element.querySelector('.key-points-title') as HTMLElement;
    if (keyPointsTitle) {
      keyPointsTitle.style.fontSize = config.compact ? '12px' : '14px';
      keyPointsTitle.style.fontWeight = '600';
      keyPointsTitle.style.marginBottom = config.compact ? '8px' : '12px';
      keyPointsTitle.style.textTransform = 'uppercase';
      keyPointsTitle.style.letterSpacing = '0.05em';
    }

    // 设置关键要点列表样式
    const keyPointsList = element.querySelector('ul') as HTMLElement;
    if (keyPointsList) {
      keyPointsList.style.marginBottom = '0px';
      keyPointsList.style.paddingLeft = config.compact ? '16px' : '20px';

      const items = keyPointsList.querySelectorAll('li');
      items.forEach((item) => {
        const element = item as HTMLElement;
        element.style.fontSize = config.compact ? '12px' : '14px';
        element.style.lineHeight = '1.4';
        element.style.marginBottom = config.compact ? '4px' : '8px';
        element.style.display = 'flex';
        element.style.alignItems = 'flex-start';
        element.style.gap = '8px';
      });
    }

    // 设置标签区域样式 - 使用专用class
    const tagsSection = element.querySelector('.tags-section') as HTMLElement;
    if (tagsSection) {
      tagsSection.style.marginBottom = config.compact ? '8px' : '16px';
    }

    // 设置标签标题样式 - 使用专用class
    const tagsTitle = element.querySelector('.tags-title') as HTMLElement;
    if (tagsTitle) {
      tagsTitle.style.fontSize = config.compact ? '12px' : '14px';
      tagsTitle.style.fontWeight = '600';
      tagsTitle.style.marginBottom = config.compact ? '8px' : '12px';
      tagsTitle.style.textTransform = 'uppercase';
      tagsTitle.style.letterSpacing = '0.05em';
    }

    // 设置标签样式
    const tags = element.querySelectorAll('[class*="badge"], span[class*="bg"]');
    tags.forEach((tag) => {
      const element = tag as HTMLElement;
      element.style.fontSize = '11px';
      element.style.padding = config.compact ? '2px 6px' : '4px 8px';
      element.style.marginRight = '4px';
      element.style.marginBottom = '4px';
      element.style.display = 'inline-block';
    });
  };

  const handleDownload = async () => {
    if (!cardRef.current || !cardData) {
      console.error('卡片引用或数据缺失');
      return;
    }

    setIsGenerating(true);
    const { width, height } = getDimensions(aspectRatio);

    console.log('开始生成图片，卡片元素:', cardRef.current);
    console.log('卡片尺寸:', cardRef.current.offsetWidth, 'x', cardRef.current.offsetHeight);

    try {
      // 等待渲染完成
      await new Promise(resolve => setTimeout(resolve, 300));

      const element = cardRef.current;
      if (!element) return;

      console.log('元素实际尺寸:', element.offsetWidth, 'x', element.offsetHeight);
      console.log('目标尺寸:', width, 'x', height);

      // 根据目标尺寸确定排版方案
      const layoutConfig = getLayoutConfig(width, height);
      console.log('排版配置:', layoutConfig);

      // 获取当前主题 - 直接从 localStorage 读取
      const storedTheme = localStorage.getItem('vite-ui-theme');
      let actualTheme: 'light' | 'dark';

      if (storedTheme === 'system') {
        // 系统主题：检查系统偏好
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        // 使用存储的主题
        actualTheme = storedTheme === 'dark' ? 'dark' : 'light';
      }

      const isDarkTheme = actualTheme === 'dark';

      // 创建适配目标尺寸的临时容器
      const tempContainer = document.createElement('div');
      tempContainer.style.width = width + 'px';
      tempContainer.style.height = height + 'px';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.backgroundColor = isDarkTheme ? '#0f172a' : '#ffffff'; // 根据主题设置背景色
      tempContainer.style.padding = '20px';
      tempContainer.style.boxSizing = 'border-box';
      tempContainer.style.overflow = 'hidden';
      document.body.appendChild(tempContainer);

      console.log('存储的主题:', storedTheme, '实际主题:', actualTheme, '是否深色:', isDarkTheme);

      // 克隆元素到临时容器并应用排版样式
      const clonedElement = element.cloneNode(true) as HTMLElement;
      applyLayoutStyles(clonedElement, layoutConfig);
      tempContainer.appendChild(clonedElement);

      // 捕获重新排版后的元素
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // 高清晰度
        backgroundColor: isDarkTheme ? '#0f172a' : '#ffffff', // 根据主题设置背景色
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: width,  // 使用目标宽度
        height: height, // 使用目标高度
        scrollX: 0,
        scrollY: 0,
        windowWidth: width,
        windowHeight: height,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          // 在克隆文档中修复样式问题
          const clonedCard = clonedDoc.querySelector('[data-card-style]') as HTMLElement;
          const styleId = clonedCard?.getAttribute('data-card-style');

          if (clonedCard && styleId) {
            console.log('修复风格:', styleId);

            // 统一处理所有风格的圆角问题
            const clonedHeader = clonedCard.querySelector('div[class*="rounded-t-"]') as HTMLElement;
            if (clonedHeader) {
              // 移除 calc() 类，应用固定圆角
              const calcClasses = Array.from(clonedHeader.classList).filter(cls => cls.includes('calc'));
              clonedHeader.classList.remove(...calcClasses);

              // 根据风格应用正确的圆角值
              switch (styleId) {
                case 'playful':
                  clonedHeader.style.borderRadius = '12px 12px 0 0';
                  break;
                case 'professional':
                  clonedHeader.style.borderRadius = '7px 7px 0 0';
                  break;
                case 'glassmorphism':
                  clonedHeader.style.borderRadius = '11px 11px 0 0';
                  break;
              }

              clonedHeader.style.boxSizing = 'border-box';
            }
          }

          // 应用排版样式到克隆文档
          applyLayoutStyles(clonedDoc.querySelector('[data-card-style]') as HTMLElement, layoutConfig);
        }
      });

      console.log('生成画布尺寸:', canvas.width, 'x', canvas.height);

      // 清理临时容器
      document.body.removeChild(tempContainer);

      // 下载画布
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}-${aspectRatio}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('生成图片失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4" data-download-button>
      <div className="flex gap-2 flex-wrap">
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          disabled={isGenerating}
        >
          <option value="800x600">4:3 (横版)</option>
          <option value="600x800">3:4 (竖版)</option>
          <option value="800x800">1:1 (正方形)</option>
          <option value="1024x576">16:9 (宽屏)</option>
          <option value="450x800">9:16 (手机竖屏)</option>
        </select>

        <Button
          onClick={handleDownload}
          disabled={isGenerating || !cardData}
          className="min-w-[120px]"
          type="button"
        >
          {isGenerating ? '生成中...' : '下载图片'}
        </Button>
      </div>
    </div>
  );
};