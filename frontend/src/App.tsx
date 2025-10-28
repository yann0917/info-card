import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoCard } from '@/components/InfoCard';
import { SimpleStyledDownload } from '@/components/SimpleStyledDownload';
import { ApiService } from '@/services/api';
import { CARD_COLORS, CARD_STYLES } from '@/constants/styles';
import type { CardData, AIProvider, ProviderInfo, CardStyle, CardColor } from '@/types';

function App() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>(CARD_STYLES[0]);
  const [selectedColor, setSelectedColor] = useState<CardColor>(CARD_COLORS[0]);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    const provider = providers.find(p => p.name === selectedProvider);
    if (provider) {
      setSelectedModel(provider.models[0] || '');
    }
  }, [selectedProvider, providers]);

  const loadProviders = async () => {
    try {
      const response = await ApiService.getSupportedProviders();
      if (response.success) {
        setProviders(response.data);
      }
    } catch (err) {
      console.error('加载提供商失败:', err);
      setError('加载 AI 提供商失败');
    }
  };

  const handleExtract = async () => {
    if (!url.trim() && !text.trim()) {
      setError('请输入 URL 或文本内容');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider: AIProvider = {
        name: selectedProvider,
        model: selectedModel,
        apiKey: apiKey || undefined
      };

      const request = {
        url: inputType === 'url' ? url : undefined,
        text: inputType === 'text' ? text : undefined,
        provider,
        style: selectedStyle,
        color: selectedColor
      };

      const response = await ApiService.extractInfo(request);

      if (response.success && response.data) {
        setCardData(response.data);
      } else {
        setError(response.error || '提取失败');
      }
    } catch (err) {
      console.error('提取失败:', err);
      setError(err instanceof Error ? err.message : '提取失败');
    } finally {
      setLoading(false);
    }
  };

  const currentProvider = providers.find(p => p.name === selectedProvider);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            智能信息卡片生成器
          </h1>
          <p className="text-gray-600">
            输入链接或文本，AI 自动提取关键信息生成精美卡片
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧配置面板 */}
          <div className="space-y-6">
            {/* 输入配置 */}
            <Card>
              <CardHeader>
                <CardTitle>内容输入</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={inputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setInputType('url')}
                  >
                    URL 链接
                  </Button>
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    onClick={() => setInputType('text')}
                  >
                    直接文本
                  </Button>
                </div>

                {inputType === 'url' ? (
                  <Input
                    placeholder="请输入网页链接..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                ) : (
                  <Textarea
                    placeholder="请输入或粘贴文本内容..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                  />
                )}
              </CardContent>
            </Card>

            {/* AI 配置 */}
            <Card>
              <CardHeader>
                <CardTitle>AI 配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    AI 提供商
                  </label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择 AI 提供商" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.name} value={provider.name}>
                          {provider.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentProvider && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      模型
                    </label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentProvider.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    API 密钥 (可选)
                  </label>
                  <Input
                    type="password"
                    placeholder="输入 API 密钥..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    留空将使用服务器配置的密钥
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 样式配置 */}
            <Card>
              <CardHeader>
                <CardTitle>卡片样式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    风格
                  </label>
                  <Select
                    value={selectedStyle.id}
                    onValueChange={(styleId) =>
                      setSelectedStyle(CARD_STYLES.find(s => s.id === styleId) || CARD_STYLES[0])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择风格" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARD_STYLES.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    配色
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CARD_COLORS.map((color) => (
                      <button
                        key={color.id}
                        className={`p-3 rounded border-2 transition-all ${
                          selectedColor.id === color.id
                            ? 'border-gray-800 shadow-md'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.background }}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color.primary }}
                          />
                          <span className="text-xs font-medium" style={{ color: color.text }}>
                            {color.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 生成按钮 */}
            <Button
              onClick={handleExtract}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? '正在生成...' : '生成信息卡片'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* 右侧卡片预览 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>卡片预览</CardTitle>
              </CardHeader>
              <CardContent>
                {cardData ? (
                  <InfoCard
                    ref={cardRef}
                    data={cardData}
                    style={selectedStyle}
                    color={selectedColor}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">
                      配置完成后点击生成按钮查看卡片效果
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 下载功能 */}
            {cardData && (
              <SimpleStyledDownload
                cardRef={cardRef}
                cardData={cardData}
                fileName={`info-card-${selectedStyle.id}-${selectedColor.id}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;