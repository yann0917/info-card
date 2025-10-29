import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme-provider';
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
  const { theme } = useTheme();

  // 根据主题获取合适的颜色
  const getThemedColor = () => {
    const isDark = theme === 'dark';
    return {
      ...color,
      background: isDark && color.darkBackground ? color.darkBackground : color.background,
      text: isDark && color.darkText ? color.darkText : color.text,
    };
  };

  const themedColor = getThemedColor();
  const getCardClasses = () => {
    const baseClasses = 'transition-all duration-300 hover:shadow-lg';

    switch (style.id) {
      case 'modern':
        return cn(baseClasses, 'border-2 shadow-md', className);
      case 'minimal':
        return cn(baseClasses, 'border-0 shadow-sm bg-muted', className);
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
      case 'advanced-glass':
        return cn(baseClasses, 'border border-white/30 shadow-2xl rounded-[0.75rem] backdrop-blur-[24px] bg-gradient-to-br from-white/15 to-white/5 relative overflow-hidden', className);
      case 'crystal-print':
        return cn(baseClasses, 'border border-white/25 shadow-2xl rounded-[0.5rem] backdrop-blur-[20px] bg-white/8 relative overflow-hidden', className);
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
      case 'advanced-glass':
        return {
          background: `linear-gradient(135deg, ${color.primary}CC, ${color.secondary}99)`,
          color: 'white',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
          position: 'relative' as const,
          overflow: 'hidden' as const
        };
      case 'crystal-print':
        return {
          background: `linear-gradient(145deg, ${color.primary}B3, ${color.accent}80)`,
          color: 'white',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.25)',
          position: 'relative' as const,
          overflow: 'hidden' as const
        };
      default:
        return { background: color.primary, color: 'white' };
    }
  };

  const getTagStyle = () => {
    switch (style.id) {
      case 'modern':
        return {
          backgroundColor: themedColor.background,
          color: themedColor.text,
          border: `1px solid ${color.secondary}`
        };
      case 'minimal':
        return {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
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
          backgroundColor: themedColor.background,
          color: themedColor.text,
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
          backgroundColor: themedColor.background,
          color: themedColor.text,
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
      case 'advanced-glass':
        return {
          background: `linear-gradient(135deg, ${color.primary}40, ${color.secondary}20)`,
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
        };
      case 'crystal-print':
        return {
          background: `linear-gradient(145deg, ${color.primary}30, ${color.accent}15)`,
          color: 'white',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 3px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.35)'
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
        <div className="absolute -top-1 -left-1 right-2 bottom-2 bg-muted/30 rounded-xl transform rotate-1 -z-10" />
      )}
      {style.id === 'cardstack' && (
        <div className="absolute -top-2 -left-2 right-4 bottom-4 bg-border/20 rounded-xl transform -rotate-1 -z-10" />
      )}

      {/* 高级玻璃拟态的光晕装饰 */}
      {(style.id === 'advanced-glass' || style.id === 'crystal-print') && (
        <>
          {/* 右上角光晕 */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-2xl -z-10"
            style={{
              background: `radial-gradient(circle, ${color.primary}40, transparent 70%)`
            }}
          />
          {/* 左下角光晕 */}
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-xl -z-10"
            style={{
              background: `radial-gradient(circle, ${color.secondary}30, transparent 70%)`
            }}
          />
          {/* 玻璃反光效果 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
          <div className="absolute top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-40" />
        </>
      )}

      <CardHeader style={getHeaderStyle()}>
        <div className="flex items-center gap-3">
          {/* 图标装饰 */}
          {(style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack' || style.id === 'advanced-glass' || style.id === 'crystal-print') && (
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              style.id === 'advanced-glass' && "bg-white/25 backdrop-blur-md border border-white/30 shadow-lg",
              style.id === 'crystal-print' && "bg-white/20 backdrop-blur-sm border border-white/25 shadow-md",
              (style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack') && "bg-white/20"
            )}>
              <InfoIcon className="w-4 h-4 text-white" />
            </div>
          )}
          <CardTitle className={cn(
            "text-xl font-bold leading-tight flex-1",
            (style.id === 'advanced-glass' || style.id === 'crystal-print') && "tracking-wide"
          )}>
            {data.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p
          className="text-foreground mb-6 leading-relaxed"
          style={{ color: themedColor.text }}
        >
          {data.description}
        </p>

        {data.keyPoints.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {(style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack' || style.id === 'advanced-glass' || style.id === 'crystal-print') && (
                <KeyIcon className={cn(
                  "w-4 h-4",
                  (style.id === 'advanced-glass' || style.id === 'crystal-print') && "text-white/80"
                )} style={{ color: style.id === 'advanced-glass' || style.id === 'crystal-print' ? undefined : color.primary }} />
              )}
              <h4
                className={cn(
                  "font-semibold text-sm uppercase tracking-wide",
                  (style.id === 'advanced-glass' || style.id === 'crystal-print') && "text-white/90"
                )}
                style={{ color: style.id === 'advanced-glass' || style.id === 'crystal-print' ? undefined : color.primary }}
              >
                关键要点
              </h4>
            </div>
            <ul className="space-y-2">
              {data.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2"
                  style={{ color: themedColor.text }}
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
              {(style.id === 'gradient' || style.id === 'glassmorphism' || style.id === 'cardstack' || style.id === 'advanced-glass' || style.id === 'crystal-print') && (
                <TagIcon className={cn(
                  "w-4 h-4",
                  (style.id === 'advanced-glass' || style.id === 'crystal-print') && "text-white/80"
                )} style={{ color: style.id === 'advanced-glass' || style.id === 'crystal-print' ? undefined : color.primary }} />
              )}
              <h4
                className={cn(
                  "font-semibold text-sm uppercase tracking-wide",
                  (style.id === 'advanced-glass' || style.id === 'crystal-print') && "text-white/90"
                )}
                style={{ color: style.id === 'advanced-glass' || style.id === 'crystal-print' ? undefined : color.primary }}
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
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              来源: {data.metadata.source}
            </p>
            <p className="text-xs text-muted-foreground">
              提取时间: {new Date(data.metadata.extractedAt).toLocaleString('zh-CN')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

InfoCard.displayName = 'InfoCard';