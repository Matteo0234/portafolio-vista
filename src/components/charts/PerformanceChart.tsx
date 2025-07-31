import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceData } from '@/services/api';

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
  height?: number;
  loading?: boolean;
}

export function PerformanceChart({ 
  data, 
  title = 'Performance Portafoglio', 
  height = 300,
  loading = false 
}: PerformanceChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">
            {new Date(label).toLocaleDateString('it-IT', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm font-medium">
            Valore: <span className="text-foreground">{formatCurrency(data.value)}</span>
          </p>
          <p className={`text-sm font-medium ${
            data.profit_loss >= 0 ? 'text-success' : 'text-danger'
          }`}>
            P&L: <span>{data.profit_loss >= 0 ? '+' : ''}{formatCurrency(data.profit_loss)}</span>
          </p>
        </div>
      );
    }
    return null;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-border/30"
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              tickFormatter={formatCurrency}
              className="text-xs fill-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}