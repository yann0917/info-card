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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const getDimensions = (ratio: string) => {
    const [width, height] = ratio.split('x').map(Number);
    return { width, height };
  };

  const handleDownload = async () => {
    if (!cardRef.current || !cardData) return;

    setIsGenerating(true);
    const { width, height } = getDimensions(aspectRatio);

    try {
      // 使用 html2canvas-pro 的标准用法
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 2倍缩放提高清晰度
        backgroundColor: null, // 使用原始背景
        useCORS: true,
        logging: false,
        removeContainer: true, // 自动清理临时元素
        ignoreElements: (element) => {
          // 忽略下载按钮等控制元素
          return element.hasAttribute('data-download-button');
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-info-card]') as HTMLElement;

          // 应用主题样式
          if (theme === 'dark' && clonedElement) {
            // 使用 CSS filter 实现暗色主题
            clonedElement.style.filter = 'invert(1) hue-rotate(180deg)';

            // 对图片元素进行反向处理
            const images = clonedElement.querySelectorAll('img');
            images.forEach((img: Element) => {
              (img as HTMLElement).style.filter = 'invert(1) hue-rotate(180deg)';
            });
          }
        }
      });

      // 创建最终的画布用于调整尺寸
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;

      finalCanvas.width = width * 2;
      finalCanvas.height = height * 2;

      // 设置背景色
      ctx.fillStyle = theme === 'dark' ? '#111827' : '#ffffff';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // 计算缩放比例以适应目标尺寸
      const sourceWidth = canvas.width;
      const sourceHeight = canvas.height;
      const targetWidth = finalCanvas.width;
      const targetHeight = finalCanvas.height;

      const scale = Math.min(
        targetWidth / sourceWidth,
        targetHeight / sourceHeight
      );

      const scaledWidth = sourceWidth * scale;
      const scaledHeight = sourceHeight * scale;

      // 居中绘制
      const offsetX = (targetWidth - scaledWidth) / 2;
      const offsetY = (targetHeight - scaledHeight) / 2;

      // 绘制卡片
      ctx.drawImage(canvas, offsetX, offsetY, scaledWidth, scaledHeight);

      // 下载图片
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}-${aspectRatio}-${theme}-${Date.now()}.png`;
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
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isGenerating}
        >
          <option value="800x600">4:3 (横版)</option>
          <option value="600x800">3:4 (竖版)</option>
          <option value="800x800">1:1 (正方形)</option>
          <option value="1024x576">16:9 (宽屏)</option>
          <option value="450x800">9:16 (手机竖屏)</option>
        </select>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isGenerating}
        >
          <option value="light">亮色主题</option>
          <option value="dark">暗色主题</option>
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