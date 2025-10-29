import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';
import { ApiService } from '@/services/api';
import { configStorage } from '@/lib/configStorage';
import type { ProviderInfo } from '@/types';

interface SettingsMenuProps {
  selectedProvider: string;
  selectedModel: string;
  apiKey: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  selectedProvider,
  selectedModel,
  apiKey,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
}) => {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    const provider = providers.find(p => p.name === selectedProvider);
    if (provider) {
      onModelChange(provider.models[0] || '');
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
    }
  };

  // 当配置变化时保存到 localStorage
  const handleProviderChange = (provider: string) => {
    onProviderChange(provider);
    configStorage.saveConfig({ selectedProvider: provider });
  };

  const handleModelChange = (model: string) => {
    onModelChange(model);
    configStorage.saveConfig({ selectedModel: model });
  };

  const handleApiKeyChange = (apiKey: string) => {
    onApiKeyChange(apiKey);
    // 注意：API 密钥不保存到 localStorage，出于安全考虑
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">设置</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4" align="end">
        <div className="space-y-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between">
            <DropdownMenuLabel className="text-lg font-semibold px-0">
              AI 配置设置
            </DropdownMenuLabel>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenuSeparator />

          {/* AI 提供商配置 */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                AI 提供商
              </label>
              <Select value={selectedProvider} onValueChange={handleProviderChange}>
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

            <div>
              <label className="block text-sm font-medium mb-2">
                模型
              </label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const currentProvider = providers.find(p => p.name === selectedProvider);
                    return currentProvider?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    )) || [];
                  })()}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                API 密钥 (可选)
              </label>
              <Input
                type="password"
                placeholder="输入 API 密钥..."
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                留空将使用服务器配置的密钥
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              关闭
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};