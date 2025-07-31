// API Service Layer for Investment Platform
// Centralizes all backend communications

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Response Types
export interface Portfolio {
  id: string;
  name: string;
  total_value: number;
  invested_amount: number;
  profit_loss: number;
  profit_loss_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: string;
  portfolio_id: string;
  symbol: string;
  name: string;
  quantity: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  sector?: string;
  asset_type: 'stock' | 'crypto' | 'etf' | 'bond';
}

export interface PerformanceData {
  date: string;
  value: number;
  profit_loss: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percentage: number;
  volume: number;
  market_cap?: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Portfolio endpoints
  async getPortfolios(): Promise<Portfolio[]> {
    return this.request<Portfolio[]>('/portfolios/');
  }

  async getPortfolio(id: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`);
  }

  async createPortfolio(data: Partial<Portfolio>): Promise<Portfolio> {
    return this.request<Portfolio>('/portfolios/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Position endpoints
  async getPositions(portfolioId?: string): Promise<Position[]> {
    const endpoint = portfolioId ? `/portfolios/${portfolioId}/positions/` : '/positions/';
    return this.request<Position[]>(endpoint);
  }

  async getPosition(id: string): Promise<Position> {
    return this.request<Position>(`/positions/${id}`);
  }

  async createPosition(data: Partial<Position>): Promise<Position> {
    return this.request<Position>('/positions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Performance endpoints
  async getPerformanceData(portfolioId: string, period?: string): Promise<PerformanceData[]> {
    const params = period ? `?period=${period}` : '';
    return this.request<PerformanceData[]>(`/portfolios/${portfolioId}/performance${params}`);
  }

  // Market data endpoints
  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    const params = symbols.join(',');
    return this.request<MarketData[]>(`/market/quotes?symbols=${params}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const portfolioApi = {
  getAll: () => apiClient.getPortfolios(),
  getById: (id: string) => apiClient.getPortfolio(id),
  create: (data: Partial<Portfolio>) => apiClient.createPortfolio(data),
};

export const positionApi = {
  getAll: (portfolioId?: string) => apiClient.getPositions(portfolioId),
  getById: (id: string) => apiClient.getPosition(id),
  create: (data: Partial<Position>) => apiClient.createPosition(data),
};

export const performanceApi = {
  getData: (portfolioId: string, period?: string) => 
    apiClient.getPerformanceData(portfolioId, period),
};

export const marketApi = {
  getQuotes: (symbols: string[]) => apiClient.getMarketData(symbols),
};