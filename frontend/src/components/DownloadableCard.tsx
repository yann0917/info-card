import React from 'react';
import { InfoCard } from './InfoCard';
import type { CardData, CardStyle, CardColor } from '@/types';

interface DownloadableCardProps {
  data: CardData;
  style: CardStyle;
  color: CardColor;
  theme: 'light' | 'dark';
  aspectRatio: { width: number; height: number };
  showMetadata?: boolean;
}

export const DownloadableCard: React.FC<DownloadableCardProps> = ({
  data,
  style,
  color,
  theme,
  aspectRatio,
  showMetadata = true
}) => {
  // 主题样式映射
  const themeStyles = {
    light: {
      background: '#ffffff',
      text: '#1f2937'
    },
    dark: {
      background: '#111827',
      text: '#f9fafb'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div
      style={{
        width: aspectRatio.width,
        height: aspectRatio.height,
        background: currentTheme.background,
        color: currentTheme.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 如果是暗色主题，应用滤镜 */}
        <div
          style={{
            filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none',
            transform: 'scale(0.9)', // 稍微缩小以适应下载区域
            transformOrigin: 'center'
          }}
        >
          <InfoCard
            data={{
              ...data,
              // 如果不显示元数据，则移除它
              ...(showMetadata ? {} : { metadata: undefined })
            }}
            style={style}
            color={color}
          />
        </div>
      </div>
    </div>
  );
};