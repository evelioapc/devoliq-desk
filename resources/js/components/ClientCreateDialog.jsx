import { useState } from 'react';
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
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function ClientCreateDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    doc_id: '',
    status: 'active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/clients', form);
      setForm({ name: '', email: '', phone: '', doc_id: '', status: 'active' });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.name?.[0] || 'Error al crear cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear cliente</DialogTitle>
            <DialogDescription>
              Agregá un nuevo cliente a tu base de datos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doc_id">Documento / CUIT</Label>
              <Input
                id="doc_id"
                value={form.doc_id}
                onChange={(e) => setForm((f) => ({ ...f, doc_id: e.target.value }))}
                placeholder="20-12345678-9"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
