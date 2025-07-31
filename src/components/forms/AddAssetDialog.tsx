import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Position } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const baseSchema = z.object({
  symbol: z.string().min(1, 'Simbolo richiesto'),
  name: z.string().min(1, 'Nome richiesto'),
  quantity: z.number().min(0.0001, 'Quantità deve essere maggiore di 0'),
  average_cost: z.number().min(0.01, 'Prezzo medio deve essere maggiore di 0'),
  asset_type: z.enum(['stock', 'crypto', 'etf', 'bond']),
});

const stockSchema = baseSchema.extend({
  sector: z.string().min(1, 'Settore richiesto per le azioni'),
});

const cryptoSchema = baseSchema;
const etfSchema = baseSchema.extend({
  expense_ratio: z.number().min(0).max(100).optional(),
});
const bondSchema = baseSchema.extend({
  maturity_date: z.string().optional(),
  yield: z.number().min(0).max(100).optional(),
});

interface AddAssetDialogProps {
  portfolioId: string;
  onAssetAdded: (asset: Partial<Position>) => void;
}

export function AddAssetDialog({ portfolioId, onAssetAdded }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [assetType, setAssetType] = useState<Position['asset_type']>('stock');
  const { toast } = useToast();

  const getSchema = () => {
    switch (assetType) {
      case 'stock': return stockSchema;
      case 'crypto': return cryptoSchema;
      case 'etf': return etfSchema;
      case 'bond': return bondSchema;
      default: return baseSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      symbol: '',
      name: '',
      quantity: 0,
      average_cost: 0,
      asset_type: assetType,
      sector: '',
      expense_ratio: undefined,
      maturity_date: '',
      yield: undefined,
    },
  });

  const onSubmit = (data: any) => {
    const newAsset: Partial<Position> = {
      portfolio_id: portfolioId,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      quantity: data.quantity,
      average_cost: data.average_cost,
      current_price: data.average_cost, // Mock current price as average cost
      market_value: data.quantity * data.average_cost,
      profit_loss: 0,
      profit_loss_percentage: 0,
      asset_type: data.asset_type,
      ...(data.sector && { sector: data.sector }),
    };

    onAssetAdded(newAsset);
    setOpen(false);
    form.reset();
    
    toast({
      title: "Asset aggiunto",
      description: `${data.symbol} è stato aggiunto al portafoglio`,
    });
  };

  const handleAssetTypeChange = (newType: Position['asset_type']) => {
    setAssetType(newType);
    form.setValue('asset_type', newType);
    // Reset form when changing asset type
    form.reset({
      ...form.getValues(),
      asset_type: newType,
      sector: '',
      expense_ratio: undefined,
      maturity_date: '',
      yield: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Asset</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del nuovo asset per il tuo portafoglio.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="asset_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo di Asset</FormLabel>
                  <Select 
                    onValueChange={(value) => handleAssetTypeChange(value as Position['asset_type'])} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo di asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="stock">Azione</SelectItem>
                      <SelectItem value="crypto">Criptovaluta</SelectItem>
                      <SelectItem value="etf">ETF</SelectItem>
                      <SelectItem value="bond">Obbligazione</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Simbolo</FormLabel>
                    <FormControl>
                      <Input placeholder="es. AAPL, BTC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Apple Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantità</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.0001"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="average_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Medio (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conditional fields based on asset type */}
            {assetType === 'stock' && (
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settore</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Technology, Healthcare" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {assetType === 'etf' && (
              <FormField
                control={form.control}
                name="expense_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense Ratio (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="es. 0.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {assetType === 'bond' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maturity_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Scadenza</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rendimento (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="es. 3.5"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annulla
              </Button>
              <Button type="submit">
                Aggiungi Asset
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}