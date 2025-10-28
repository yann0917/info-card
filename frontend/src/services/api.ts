import type { ExtractRequest, ExtractResponse, ProviderInfo } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiService {
  static async extractInfo(request: ExtractRequest): Promise<ExtractResponse> {
    const response = await fetch(`${API_BASE_URL}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async getSupportedProviders(): Promise<{ success: boolean; data: ProviderInfo[] }> {
    const response = await fetch(`${API_BASE_URL}/providers`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async healthCheck(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}