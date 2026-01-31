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
import { Loader2, Trash2 } from 'lucide-react';

const defaultForm = {
  name: '',
  price: '',
  duration_minutes: '',
  status: 'active',
};

export default function ServiceDialog({ open, onOpenChange, initial, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(defaultForm);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = !!initial?.id;

  useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      setErrors({});
      if (initial) {
        setForm({
          name: initial.name ?? '',
          price: initial.price != null ? String(initial.price) : '',
          duration_minutes: initial.duration_minutes != null ? String(initial.duration_minutes) : '',
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
      const payload = {
        name: form.name,
        price: form.price ? parseFloat(form.price) : 0,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes, 10) : 0,
        status: form.status,
      };
      if (isEdit) {
        await api.put(`/services/${initial.id}`, payload);
      } else {
        await api.post('/services', payload);
      }
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ _general: err.response?.data?.message || 'Error al guardar servicio' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    setErrors({});
    setLoading(true);
    try {
      await api.delete(`/services/${initial.id}`);
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors({ _general: err.response?.data?.message || 'Error al eliminar' });
      } else {
        setErrors({ _general: err.response?.data?.message || 'Error al eliminar' });
      }
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleOpenChange = (next) => {
    if (!next) {
      setConfirmDelete(false);
      setErrors({});
    }
    onOpenChange(next);
  };

  if (confirmDelete) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar servicio?</DialogTitle>
            <DialogDescription>
              "{initial?.name}" se eliminará permanentemente. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {errors._general && (
            <p className="text-sm text-destructive">{errors._general}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Editar servicio' : 'Crear servicio'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modificá los datos del servicio.' : 'Agregá un nuevo servicio al catálogo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {errors._general && (
              <p className="text-sm text-destructive">{errors._general}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="service-name">Nombre *</Label>
              <Input
                id="service-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Reparación básica"
                required
              />
              {errors.name?.[0] && (
                <p className="text-xs text-destructive">{errors.name[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-price">Precio</Label>
              <Input
                id="service-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0"
              />
              {errors.price?.[0] && (
                <p className="text-xs text-destructive">{errors.price[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-duration">Duración (minutos)</Label>
              <Input
                id="service-duration"
                type="number"
                min="0"
                value={form.duration_minutes}
                onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
                placeholder="60"
              />
              {errors.duration_minutes?.[0] && (
                <p className="text-xs text-destructive">{errors.duration_minutes[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Estado</Label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
              {errors.status?.[0] && (
                <p className="text-xs text-destructive">{errors.status[0]}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
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
