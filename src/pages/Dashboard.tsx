import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/ui/metric-card';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { AssetAllocationChart } from '@/components/charts/AssetAllocationChart';
import { PositionsTable } from '@/components/tables/PositionsTable';
import { AddAssetDialog } from '@/components/forms/AddAssetDialog';
import { 
  Portfolio, 
  Position, 
  PerformanceData,
  portfolioApi,
  positionApi,
  performanceApi
} from '@/services/api';
import { mockApi } from '@/services/mockData';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Activity,
  PieChart,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Calculate aggregate metrics
  const totalValue = portfolios.reduce((sum, p) => sum + p.total_value, 0);
  const totalInvested = portfolios.reduce((sum, p) => sum + p.invested_amount, 0);
  const totalProfitLoss = portfolios.reduce((sum, p) => sum + p.profit_loss, 0);
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  const loadData = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
        toast({
          title: "Aggiornamento dati...",
          description: "Sincronizzazione con il backend in corso",
        });
      }

      // In development, use mock data
      // In production, use real API calls
      const isDevelopment = import.meta.env.MODE === 'development';
      
      if (isDevelopment) {
        // Use mock data for smooth development experience
        const [portfoliosData, positionsData, performanceDataResult] = await Promise.all([
          mockApi.getPortfolios(),
          mockApi.getPositions(),
          mockApi.getPerformanceData('1'), // Main portfolio
        ]);

        setPortfolios(portfoliosData);
        setPositions(positionsData);
        setPerformanceData(performanceDataResult);
      } else {
        // Use real API calls in production
        const [portfoliosData, positionsData] = await Promise.all([
          portfolioApi.getAll(),
          positionApi.getAll(),
        ]);

        setPortfolios(portfoliosData);
        setPositions(positionsData);

        // Get performance data for the first portfolio
        if (portfoliosData.length > 0) {
          const performanceDataResult = await performanceApi.getData(portfoliosData[0].id);
          setPerformanceData(performanceDataResult);
        }
      }

      if (showRefreshToast) {
        toast({
          title: "Dati aggiornati",
          description: "I dati del portafoglio sono stati sincronizzati con successo",
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Errore nel caricamento",
        description: "Impossibile caricare i dati del portafoglio. Usando dati mock.",
        variant: "destructive",
      });

      // Fallback to mock data
      const [portfoliosData, positionsData, performanceDataResult] = await Promise.all([
        mockApi.getPortfolios(),
        mockApi.getPositions(),
        mockApi.getPerformanceData('1'),
      ]);

      setPortfolios(portfoliosData);
      setPositions(positionsData);
      setPerformanceData(performanceDataResult);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssetAdded = (newAsset: Partial<Position>) => {
    const asset: Position = {
      id: Math.random().toString(36).substr(2, 9),
      portfolio_id: portfolios[0]?.id || '1',
      symbol: newAsset.symbol!,
      name: newAsset.name!,
      quantity: newAsset.quantity!,
      average_cost: newAsset.average_cost!,
      current_price: newAsset.current_price!,
      market_value: newAsset.market_value!,
      profit_loss: newAsset.profit_loss!,
      profit_loss_percentage: newAsset.profit_loss_percentage!,
      asset_type: newAsset.asset_type!,
      ...(newAsset.sector && { sector: newAsset.sector }),
    };
    
    setPositions(prev => [...prev, asset]);
  };

  const handleAssetUpdated = (assetId: string, updates: Partial<Position>) => {
    setPositions(prev => 
      prev.map(pos => 
        pos.id === assetId ? { ...pos, ...updates } : pos
      )
    );
  };

  const handleAssetDeleted = (assetId: string) => {
    setPositions(prev => prev.filter(pos => pos.id !== assetId));
    toast({
      title: "Asset eliminato",
      description: "L'asset è stato rimosso dal portafoglio",
    });
  };

  const handleRefresh = () => {
    loadData(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard Investimenti
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitora e analizza i tuoi portafogli di investimento
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Valore Totale"
            value={totalValue}
            currency
            icon={<Wallet className="h-4 w-4" />}
            loading={loading}
          />
          <MetricCard
            title="Capitale Investito"
            value={totalInvested}
            currency
            icon={<DollarSign className="h-4 w-4" />}
            loading={loading}
          />
          <MetricCard
            title="Profitto/Perdita"
            value={totalProfitLoss}
            changePercentage={totalProfitLossPercentage}
            currency
            icon={<TrendingUp className="h-4 w-4" />}
            trend={totalProfitLoss >= 0 ? 'up' : 'down'}
            loading={loading}
          />
          <MetricCard
            title="Posizioni Attive"
            value={positions.length}
            icon={<Activity className="h-4 w-4" />}
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart 
            data={performanceData}
            loading={loading}
            height={350}
          />
          <AssetAllocationChart 
            positions={positions}
            loading={loading}
            height={350}
            groupBy="asset_type"
            title="Allocazione per Tipo di Asset"
          />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetAllocationChart 
            positions={positions.filter(p => p.asset_type === 'stock')}
            loading={loading}
            height={350}
            groupBy="sector"
            title="Allocazione per Settore (Solo Azioni)"
          />
          <div className="flex items-center justify-center bg-gradient-card rounded-lg border border-border/50 p-8">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Prossimamente</h3>
              <p className="text-sm">
                Analisi avanzate e grafici aggiuntivi in arrivo
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Management */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestione Portafoglio</h2>
            <AddAssetDialog 
              portfolioId={portfolios[0]?.id || '1'} 
              onAssetAdded={handleAssetAdded}
            />
          </div>
          <PositionsTable 
            positions={positions}
            loading={loading}
            onAssetUpdated={handleAssetUpdated}
            onAssetDeleted={handleAssetDeleted}
          />
        </div>
      </div>
    </div>
  );
}