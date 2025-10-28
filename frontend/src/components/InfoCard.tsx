import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CardData, CardStyle, CardColor } from '@/types';
import { cn } from '@/lib/utils';

// 图标组件
const InfoIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const KeyIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
  </svg>
);

const TagIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

interface InfoCardProps {
  data: CardData;
  style: CardStyle;
  color: CardColor;
  className?: string;
}

export const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(({ data, style, color, className }, ref) => {
  const getCardClasses = () => {
    const baseClasses = 'transition-all duration-300 hover:shadow-lg';

    switch (style.id) {
      case 'modern':
        return cn(baseClasses, 'border-2 shadow-md', className);
      case 'minimal':
        return cn(baseClasses, 'border-0 shadow-sm bg-gray-50', className);
      case 'elegant':
        return cn(baseClasses, 'border-2 shadow-lg', className);
      case 'playful':
        return cn(baseClasses, 'border-4 shadow-xl rounded-2xl', className);
      case 'professional':
        return cn(baseClasses, 'border shadow-md', className);
      case 'gradient':
        return cn(baseClasses, 'border-0 shadow-2xl rounded-xl overflow-hidden', className);
      case 'glassmorphism':
        return cn(baseClasses, 'border border-white/20 shadow-2xl rounded-xl backdrop-blur-md bg-white/10', className);
      case 'neumorphic':
        return cn(baseClasses, 'border-0 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]', className);
      case 'cardstack':
        return cn(baseClasses, 'border-0 rounded-xl shadow-2xl relative', className);
      default:
        return cn(baseClasses, className);
    }
  };

  const getHeaderStyle = () => {
    switch (style.id) {
      case 'modern':
        return {
          background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
          color: 'white'
        };
      case 'minimal':
        return {
          borderBottom: `2px solid ${color.primary}`,
          color: color.text
        };
      case 'elegant':
        return {
          background: `linear-gradient(45deg, ${color.primary}, ${color.accent})`,
          color: 'white'
        };
      case 'playful':
        return {
          background: color.accent,
          color: 'white'
        };
      case 'professional':
        return {
          background: color.primary,
          color: 'white'
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 50%, ${color.accent} 100%)`,
          color: 'white',
          position: 'relative' as const,
          overflow: 'hidden' as const
        };
      case 'glassmorphism':
        return {
          background: `linear-gradient(135deg, ${color.primary}80, ${color.secondary}80)`,
          color: 'white',
          backdropFilter: 'blur(10px)'
        };
      case 'neumorphic':
        return {
          background: `linear-gradient(145deg, ${color.background}, ${color.primary}20)`,
          color: color.text,
          border: `1px solid ${color.primary}30`
        };
      case 'cardstack':
        return {
          background: `linear-gradient(135deg, ${color.primary}, ${color.accent})`,
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        };
      default:
        return { background: color.primary, color: 'white' };
    }
  };

  const getTagStyle = () => {
    switch (style.id) {
      case 'modern':
        return {
          backgroundColor: color.background,
          color: color.text,
          border: `1px solid ${color.secondary}`
        };
      case 'minimal':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: 'none'
        };
      case 'elegant':
        return {
          backgroundColor: color.secondary,
          color: 'white',
          border: 'none'
        };
      case 'playful':
        return {
          backgroundColor: color.accent,
          color: 'white',
          border: 'none'
        };
      case 'professional':
        return {
          backgroundColor: color.background,
          color: color.text,
          border: `1px solid ${color.primary}`
        };
      case 'gradient':
        return {
          background: `linear-gradient(45deg, ${color.primary}, ${color.secondary})`,
          color: 'white',
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        };
      case 'glassmorphism':
        return {
          backgroundColor: `${color.primary}30`,
          color: color.text,
          border: `1px solid ${color.primary}50`,
          backdropFilter: 'blur(10px)'
        };
      case 'neumorphic':
        return {
          backgroundColor: color.background,
          color: color.text,
          border: `1px solid ${color.primary}20`,
          boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.9)'
        };
      case 'cardstack':
        return {
          backgroundColor: color.secondary,
          color: 'white',
          border: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        };
      default:
        return { backgroundColor: color.secondary, color: 'white' };
    }
  };

  return (
    <Card
      ref={ref}
      className={getCardClasses()}
      style={{ borderColor: color.primary }}
    >
      {/* 卡片堆叠效果的装饰背景 */}
      {style.id === 'cardstack' && (
        <div className="absolute -top-1 -left-1 right-2 bottom-2 bg-gray-200/30 rounded-xl transform rotate-1 -z-10" />
      )}
      {style.id === 'cardstack' && (
        <div className="absolute -top-2 -left-2 right-4 bottom-4 bg-gray-300/20 rounded-xl transform -rotate-1 -z-10" />
      )}

      <CardHeader style={getHeaderStyle()}>
        <div className="flex items-center gap-3">
          {/* 图标装饰 */}
          {(style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack') && (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <InfoIcon className="w-4 h-4" />
            </div>
          )}
          <CardTitle className="text-xl font-bold leading-tight flex-1">
            {data.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p
          className="text-gray-700 mb-6 leading-relaxed"
          style={{ color: color.text }}
        >
          {data.description}
        </p>

        {data.keyPoints.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {(style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack') && (
                <KeyIcon className="w-4 h-4" style={{ color: color.primary }} />
              )}
              <h4
                className="font-semibold text-sm uppercase tracking-wide"
                style={{ color: color.primary }}
              >
                关键要点
              </h4>
            </div>
            <ul className="space-y-2">
              {data.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2"
                  style={{ color: color.text }}
                >
                  <span
                    className="text-xs font-bold mt-1"
                    style={{ color: color.accent }}
                  >
                    •
                  </span>
                  <span className="text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              {(style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack') && (
                <TagIcon className="w-4 h-4" style={{ color: color.primary }} />
              )}
              <h4
                className="font-semibold text-sm uppercase tracking-wide"
                style={{ color: color.primary }}
              >
                标签
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                  style={getTagStyle()}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.metadata?.source && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              来源: {data.metadata.source}
            </p>
            <p className="text-xs text-gray-500">
              提取时间: {new Date(data.metadata.extractedAt).toLocaleString('zh-CN')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

InfoCard.displayName = 'InfoCard';