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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Position } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const editSchema = z.object({
  quantity: z.number().min(0.0001, 'Quantità deve essere maggiore di 0'),
  average_cost: z.number().min(0.01, 'Prezzo medio deve essere maggiore di 0'),
  sector: z.string().optional(),
});

interface EditAssetDialogProps {
  asset: Position;
  onAssetUpdated: (assetId: string, updates: Partial<Position>) => void;
}

export function EditAssetDialog({ asset, onAssetUpdated }: EditAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      quantity: asset.quantity,
      average_cost: asset.average_cost,
      sector: asset.sector || '',
    },
  });

  const onSubmit = (data: any) => {
    const updates: Partial<Position> = {
      quantity: data.quantity,
      average_cost: data.average_cost,
      market_value: data.quantity * asset.current_price,
      profit_loss: (data.quantity * asset.current_price) - (data.quantity * data.average_cost),
      ...(data.sector && { sector: data.sector }),
    };

    // Recalculate profit/loss percentage
    updates.profit_loss_percentage = updates.profit_loss! / (data.quantity * data.average_cost) * 100;

    onAssetUpdated(asset.id, updates);
    setOpen(false);
    
    toast({
      title: "Asset aggiornato",
      description: `${asset.symbol} è stato aggiornato con successo`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Modifica {asset.symbol}</DialogTitle>
          <DialogDescription>
            Aggiorna i dettagli per {asset.name}.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {asset.asset_type === 'stock' && (
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

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Prezzo Corrente: €{asset.current_price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Nuovo Valore di Mercato: €{(form.watch('quantity') * asset.current_price).toFixed(2)}
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annulla
              </Button>
              <Button type="submit">
                Aggiorna Asset
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}