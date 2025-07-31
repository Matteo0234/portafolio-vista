import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Position } from '@/services/api';

interface AssetAllocationChartProps {
  positions: Position[];
  title?: string;
  height?: number;
  groupBy?: 'sector' | 'asset_type';
  loading?: boolean;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--danger))',
  'hsl(142, 76%, 45%)',
  'hsl(45, 93%, 55%)',
  'hsl(260, 84%, 65%)',
  'hsl(200, 84%, 65%)',
];

export function AssetAllocationChart({ 
  positions, 
  title = 'Allocazione Asset', 
  height = 300,
  groupBy = 'sector',
  loading = false 
}: AssetAllocationChartProps) {
  const processData = () => {
    const groupedData = positions.reduce((acc, position) => {
      const key = groupBy === 'sector' 
        ? position.sector || position.asset_type 
        : position.asset_type;
      
      if (!acc[key]) {
        acc[key] = {
          name: key,
          value: 0,
          count: 0,
        };
      }
      
      acc[key].value += position.market_value;
      acc[key].count += 1;
      
      return acc;
    }, {} as Record<string, { name: string; value: number; count: number }>);

    return Object.values(groupedData).map((item, index) => ({
      ...item,
      percentage: ((item.value / positions.reduce((sum, p) => sum + p.market_value, 0)) * 100),
      color: COLORS[index % COLORS.length],
    }));
  };

  const data = processData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Valore: <span className="text-foreground">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentuale: <span className="text-foreground">{data.percentage.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Posizioni: <span className="text-foreground">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.value} ({data[index]?.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-[300px] bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Nessun dato disponibile
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              outerRadius={80}
              innerRadius={30}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}