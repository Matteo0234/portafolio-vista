// Mock Data for Development
// Realistic investment data for testing UI components

import { Portfolio, Position, PerformanceData, MarketData } from './api';

export const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Portafoglio Principale',
    total_value: 156750.80,
    invested_amount: 145000.00,
    profit_loss: 11750.80,
    profit_loss_percentage: 8.1,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-07-31T12:00:00Z',
  },
  {
    id: '2',
    name: 'Portafoglio Crypto',
    total_value: 23420.15,
    invested_amount: 28000.00,
    profit_loss: -4579.85,
    profit_loss_percentage: -16.4,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-07-31T12:00:00Z',
  },
];

export const mockPositions: Position[] = [
  {
    id: '1',
    portfolio_id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    average_cost: 180.25,
    current_price: 195.30,
    market_value: 9765.00,
    profit_loss: 752.50,
    profit_loss_percentage: 8.34,
    sector: 'Technology',
    asset_type: 'stock',
  },
  {
    id: '2',
    portfolio_id: '1',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    quantity: 30,
    average_cost: 420.80,
    current_price: 445.20,
    market_value: 13356.00,
    profit_loss: 732.00,
    profit_loss_percentage: 5.80,
    sector: 'Technology',
    asset_type: 'stock',
  },
  {
    id: '3',
    portfolio_id: '1',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 25,
    average_cost: 2650.00,
    current_price: 2725.50,
    market_value: 68137.50,
    profit_loss: 1887.50,
    profit_loss_percentage: 2.85,
    sector: 'Technology',
    asset_type: 'stock',
  },
  {
    id: '4',
    portfolio_id: '1',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    quantity: 15,
    average_cost: 845.30,
    current_price: 780.25,
    market_value: 11703.75,
    profit_loss: -975.75,
    profit_loss_percentage: -7.70,
    sector: 'Consumer Cyclical',
    asset_type: 'stock',
  },
  {
    id: '5',
    portfolio_id: '1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    quantity: 20,
    average_cost: 520.15,
    current_price: 595.80,
    market_value: 11916.00,
    profit_loss: 1513.00,
    profit_loss_percentage: 14.53,
    sector: 'Technology',
    asset_type: 'stock',
  },
  {
    id: '6',
    portfolio_id: '2',
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.5,
    average_cost: 48000.00,
    current_price: 45200.00,
    market_value: 22600.00,
    profit_loss: -1400.00,
    profit_loss_percentage: -5.83,
    asset_type: 'crypto',
  },
  {
    id: '7',
    portfolio_id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    quantity: 8,
    average_cost: 3200.00,
    current_price: 2950.00,
    market_value: 23600.00,
    profit_loss: -2000.00,
    profit_loss_percentage: -7.81,
    asset_type: 'crypto',
  },
];

export const mockPerformanceData: PerformanceData[] = [
  { date: '2024-01-01', value: 145000.00, profit_loss: 0 },
  { date: '2024-01-15', value: 148200.00, profit_loss: 3200.00 },
  { date: '2024-02-01', value: 151800.00, profit_loss: 6800.00 },
  { date: '2024-02-15', value: 149600.00, profit_loss: 4600.00 },
  { date: '2024-03-01', value: 153400.00, profit_loss: 8400.00 },
  { date: '2024-03-15', value: 156200.00, profit_loss: 11200.00 },
  { date: '2024-04-01', value: 154800.00, profit_loss: 9800.00 },
  { date: '2024-04-15', value: 158600.00, profit_loss: 13600.00 },
  { date: '2024-05-01', value: 155900.00, profit_loss: 10900.00 },
  { date: '2024-05-15', value: 159300.00, profit_loss: 14300.00 },
  { date: '2024-06-01', value: 157200.00, profit_loss: 12200.00 },
  { date: '2024-06-15', value: 161800.00, profit_loss: 16800.00 },
  { date: '2024-07-01', value: 158400.00, profit_loss: 13400.00 },
  { date: '2024-07-15', value: 162900.00, profit_loss: 17900.00 },
  { date: '2024-07-31', value: 156750.80, profit_loss: 11750.80 },
];

export const mockMarketData: MarketData[] = [
  {
    symbol: 'AAPL',
    price: 195.30,
    change: 2.45,
    change_percentage: 1.27,
    volume: 45672800,
    market_cap: 3024000000000,
  },
  {
    symbol: 'MSFT',
    price: 445.20,
    change: -1.85,
    change_percentage: -0.41,
    volume: 28934500,
    market_cap: 3308000000000,
  },
  {
    symbol: 'GOOGL',
    price: 2725.50,
    change: 15.75,
    change_percentage: 0.58,
    volume: 1245600,
    market_cap: 1712000000000,
  },
  {
    symbol: 'TSLA',
    price: 780.25,
    change: -12.80,
    change_percentage: -1.61,
    volume: 42856700,
    market_cap: 247000000000,
  },
  {
    symbol: 'NVDA',
    price: 595.80,
    change: 8.90,
    change_percentage: 1.52,
    volume: 38294100,
    market_cap: 1468000000000,
  },
];

// Mock API functions that simulate backend calls
export const mockApi = {
  // Simulate network delay
  delay: (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms)),

  async getPortfolios(): Promise<Portfolio[]> {
    await this.delay();
    return mockPortfolios;
  },

  async getPortfolio(id: string): Promise<Portfolio> {
    await this.delay();
    const portfolio = mockPortfolios.find(p => p.id === id);
    if (!portfolio) throw new Error('Portfolio not found');
    return portfolio;
  },

  async getPositions(portfolioId?: string): Promise<Position[]> {
    await this.delay();
    return portfolioId 
      ? mockPositions.filter(p => p.portfolio_id === portfolioId)
      : mockPositions;
  },

  async getPerformanceData(portfolioId: string): Promise<PerformanceData[]> {
    await this.delay();
    return mockPerformanceData;
  },

  async getMarketData(): Promise<MarketData[]> {
    await this.delay(300);
    return mockMarketData;
  },
};