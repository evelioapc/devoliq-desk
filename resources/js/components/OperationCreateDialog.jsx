import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/SearchableSelect';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function OperationCreateDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [client, setClient] = useState(null);
  const [service, setService] = useState(null);
  const [amount, setAmount] = useState('');
  const [performedAt, setPerformedAt] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchClients = useCallback(async (q) => {
    const r = await api.get('/clients', { params: { q: q || undefined, per_page: 50 } });
    return r.data?.data ?? r.data ?? [];
  }, []);

  const fetchServices = useCallback(async (q) => {
    const r = await api.get('/services', { params: { q: q || undefined, per_page: 50 } });
    return r.data?.data ?? r.data ?? [];
  }, []);

  const handleServiceSelect = (s) => {
    setService(s);
    if (!amount || amount === '0') setAmount(String(s.price ?? 0));
  };

  const reset = () => {
    setClient(null);
    setService(null);
    setAmount('');
    setPerformedAt(format(new Date(), 'yyyy-MM-dd'));
    setError('');
  };

  const handleOpenChange = (o) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client || !service) {
      setError('Seleccioná un cliente y un servicio');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/operations', {
        client_id: client.id,
        service_id: service.id,
        amount: amount ? parseFloat(amount) : service.price,
        status: 'done',
        performed_at: performedAt || undefined,
      });
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors || {}).flat()[0]
        || 'Error al crear operación';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva operación</DialogTitle>
            <DialogDescription>
              Registrá una operación para un cliente. El monto se autocompleta desde el servicio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="grid gap-2">
              <Label>Cliente *</Label>
              <SearchableSelect
                value={client?.name}
                onSelect={setClient}
                fetchOptions={fetchClients}
                placeholder="Buscar cliente..."
                labelKey="name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Servicio *</Label>
              <SearchableSelect
                value={service?.name}
                onSelect={handleServiceSelect}
                fetchOptions={fetchServices}
                placeholder="Buscar servicio..."
                labelKey="name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Monto (se autocompleta desde el servicio)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="performedAt">Fecha</Label>
              <Input
                id="performedAt"
                type="date"
                value={performedAt}
                onChange={(e) => setPerformedAt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !client || !service}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear operación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
