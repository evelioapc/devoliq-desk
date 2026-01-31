import { useState, useEffect } from 'react';
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

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  doc_id: '',
  address: '',
  notes: '',
  status: 'active',
};

export default function ClientDialog({ open, onOpenChange, initial, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(defaultForm);

  const isEdit = !!initial?.id;

  useEffect(() => {
    if (open) {
      setErrors({});
      if (initial) {
        setForm({
          name: initial.name ?? '',
          email: initial.email ?? '',
          phone: initial.phone ?? '',
          doc_id: initial.doc_id ?? '',
          address: initial.address ?? '',
          notes: initial.notes ?? '',
          status: initial.status ?? 'active',
        });
      } else {
        setForm(defaultForm);
      }
    }
  }, [open, initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await api.put(`/clients/${initial.id}`, payload);
      } else {
        await api.post('/clients', payload);
      }
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ _general: err.response?.data?.message || 'Error al guardar' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Editar cliente' : 'Crear cliente'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modificá los datos del cliente.' : 'Agregá un nuevo cliente.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {errors._general && <p className="text-sm text-destructive">{errors._general}</p>}
            <div className="grid gap-2">
              <Label htmlFor="client-name">Nombre *</Label>
              <Input id="client-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Juan Pérez" required />
              {errors.name?.[0] && <p className="text-xs text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-email">Email</Label>
              <Input id="client-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="juan@ejemplo.com" />
              {errors.email?.[0] && <p className="text-xs text-destructive">{errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-phone">Teléfono</Label>
              <Input id="client-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+54 11 1234-5678" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-doc_id">Documento / CUIT</Label>
              <Input id="client-doc_id" value={form.doc_id} onChange={(e) => setForm((f) => ({ ...f, doc_id: e.target.value }))} placeholder="20-12345678-9" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-address">Dirección</Label>
              <Input id="client-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Calle 123" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-notes">Notas</Label>
              <textarea id="client-notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Notas..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label>Estado</Label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
