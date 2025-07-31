import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Position } from '@/services/api';
import { EditAssetDialog } from '@/components/forms/EditAssetDialog';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PositionsTableProps {
  positions: Position[];
  title?: string;
  loading?: boolean;
  onAssetUpdated?: (assetId: string, updates: Partial<Position>) => void;
  onAssetDeleted?: (assetId: string) => void;
}

export function PositionsTable({ 
  positions, 
  title = 'Posizioni Attuali',
  loading = false,
  onAssetUpdated,
  onAssetDeleted 
}: PositionsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
  };

  const getAssetTypeBadge = (assetType: Position['asset_type']) => {
    const variants = {
      stock: 'bg-primary/10 text-primary border-primary/20',
      crypto: 'bg-warning/10 text-warning border-warning/20',
      etf: 'bg-success/10 text-success border-success/20',
      bond: 'bg-muted/50 text-muted-foreground border-muted',
    };

    const labels = {
      stock: 'Azione',
      crypto: 'Crypto',
      etf: 'ETF',
      bond: 'Obbligazione',
    };

    return (
      <Badge variant="outline" className={variants[assetType]}>
        {labels[assetType]}
      </Badge>
    );
  };

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded animate-pulse w-16" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Asset</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Quantità</TableHead>
                <TableHead className="text-right">Prezzo Medio</TableHead>
                <TableHead className="text-right">Prezzo Corrente</TableHead>
                <TableHead className="text-right">Valore Mercato</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                {(onAssetUpdated || onAssetDeleted) && <TableHead>Azioni</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LoadingSkeleton />
              ) : positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nessuna posizione trovata
                  </TableCell>
                </TableRow>
              ) : (
                positions.map((position) => (
                  <TableRow key={position.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAssetTypeBadge(position.asset_type)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {position.quantity.toLocaleString('it-IT', {
                        minimumFractionDigits: position.asset_type === 'crypto' ? 4 : 0,
                        maximumFractionDigits: position.asset_type === 'crypto' ? 4 : 0,
                      })}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(position.average_cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(position.current_price)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(position.market_value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={cn(
                        'flex items-center justify-end gap-1 font-medium',
                        position.profit_loss >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {position.profit_loss >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <div className="text-right">
                          <div className="font-mono">
                            {formatCurrency(position.profit_loss)}
                          </div>
                          <div className="text-xs">
                            {formatPercentage(position.profit_loss_percentage)}
                          </div>
                        </div>
                    </div>
                  </TableCell>
                  {(onAssetUpdated || onAssetDeleted) && (
                    <TableCell>
                      <div className="flex space-x-1">
                        {onAssetUpdated && (
                          <EditAssetDialog 
                            asset={position} 
                            onAssetUpdated={onAssetUpdated}
                          />
                        )}
                        {onAssetDeleted && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminare {position.symbol}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Questa azione non può essere annullata. L'asset verrà rimosso permanentemente dal portafoglio.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annulla</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onAssetDeleted(position.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Elimina
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}