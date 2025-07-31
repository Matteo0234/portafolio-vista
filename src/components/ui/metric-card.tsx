import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePercentage?: number;
  currency?: boolean;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changePercentage, 
  currency = false,
  icon,
  className,
  trend,
  loading = false
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (loading) return '...';
    
    if (currency && typeof val === 'number') {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
      }).format(val);
    }
    
    return val;
  };

  const formatChange = (val: number, isPercentage: boolean = false) => {
    if (loading) return '';
    
    const prefix = val >= 0 ? '+' : '';
    const suffix = isPercentage ? '%' : '';
    
    if (isPercentage) {
      return `${prefix}${val.toFixed(2)}${suffix}`;
    }
    
    return currency 
      ? `${prefix}${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val)}`
      : `${prefix}${val}${suffix}`;
  };

  const getTrendColor = () => {
    if (loading) return '';
    
    if (trend) {
      switch (trend) {
        case 'up': return 'text-success';
        case 'down': return 'text-danger';
        case 'neutral': return 'text-muted-foreground';
      }
    }
    
    if (change !== undefined) {
      return change >= 0 ? 'text-success' : 'text-danger';
    }
    
    if (changePercentage !== undefined) {
      return changePercentage >= 0 ? 'text-success' : 'text-danger';
    }
    
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (loading) return null;
    
    if (trend) {
      switch (trend) {
        case 'up': return <TrendingUp className="h-4 w-4" />;
        case 'down': return <TrendingDown className="h-4 w-4" />;
        case 'neutral': return <Minus className="h-4 w-4" />;
      }
    }
    
    if (change !== undefined) {
      return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    }
    
    if (changePercentage !== undefined) {
      return changePercentage >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    }
    
    return null;
  };

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg border-border/50 bg-gradient-card',
      loading && 'animate-pulse',
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-1">
          <div className={cn(
            'text-2xl font-bold tracking-tight',
            loading && 'bg-muted rounded animate-pulse h-8'
          )}>
            {loading ? '' : formatValue(value)}
          </div>
          
          {(change !== undefined || changePercentage !== undefined) && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              getTrendColor()
            )}>
              {getTrendIcon()}
              <span>
                {change !== undefined && formatChange(change)}
                {change !== undefined && changePercentage !== undefined && ' '}
                {changePercentage !== undefined && `(${formatChange(changePercentage, true)})`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}