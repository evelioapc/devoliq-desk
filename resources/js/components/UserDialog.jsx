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

function randomPassword(length = 12) {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const defaultForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'operator',
};

export default function UserDialog({ open, onOpenChange, initial, currentUserId, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(defaultForm);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const isEdit = !!initial?.id;
  const isSelf = initial && currentUserId && Number(initial.id) === Number(currentUserId);

  useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      setErrors({});
      setGeneratedPassword('');
      if (initial) {
        setForm({
          name: initial.name ?? '',
          email: initial.email ?? '',
          password: '',
          password_confirmation: '',
          role: initial.role ?? 'operator',
        });
      } else {
        const pwd = randomPassword();
        setForm({
          ...defaultForm,
          password: pwd,
          password_confirmation: pwd,
        });
        setGeneratedPassword(pwd);
      }
    }
  }, [open, initial]);

  const handleGeneratePassword = () => {
    const pwd = randomPassword();
    setForm((f) => ({ ...f, password: pwd, password_confirmation: pwd }));
    setGeneratedPassword(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (isEdit) {
        if (form.password && form.password.length >= 8) {
          payload.password = form.password;
          payload.password_confirmation = form.password_confirmation || form.password;
        }
        await api.put(`/users/${initial.id}`, payload);
      } else {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
        await api.post('/users', payload);
      }
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ _general: err.response?.data?.message || 'Error al guardar usuario' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || isSelf) return;
    setErrors({});
    setLoading(true);
    try {
      await api.delete(`/users/${initial.id}`);
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar';
      setErrors({ _general: msg });
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleOpenChange = (next) => {
    if (!next) {
      setConfirmDelete(false);
      setErrors({});
      setGeneratedPassword('');
    }
    onOpenChange(next);
  };

  if (confirmDelete) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              {isSelf
                ? 'No podés eliminar tu propio usuario.'
                : `"${initial?.name}" será eliminado. No podrá acceder al sistema.`}
            </DialogDescription>
          </DialogHeader>
          {errors._general && (
            <p className="text-sm text-destructive">{errors._general}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            {!isSelf && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Eliminar
              </Button>
            )}
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
            <DialogTitle>{isEdit ? 'Editar usuario' : 'Invitar usuario'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modificá los datos del usuario.' : 'Agregá un nuevo usuario a tu compañía.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {errors._general && (
              <p className="text-sm text-destructive">{errors._general}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="user-name">Nombre *</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Juan Pérez"
                required
              />
              {errors.name?.[0] && (
                <p className="text-xs text-destructive">{errors.name[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="juan@empresa.com"
                required
                readOnly={isEdit}
              />
              {isEdit && (
                <p className="text-xs text-muted-foreground">El email no se puede cambiar.</p>
              )}
              {errors.email?.[0] && (
                <p className="text-xs text-destructive">{errors.email[0]}</p>
              )}
            </div>
            {!isEdit && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="user-password">Contraseña *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="user-password"
                      type="text"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value, password_confirmation: e.target.value }))}
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleGeneratePassword}>
                      Generar
                    </Button>
                  </div>
                  {generatedPassword && (
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      Guardá esta contraseña para compartirla con el usuario: {generatedPassword}
                    </p>
                  )}
                  {errors.password?.[0] && (
                    <p className="text-xs text-destructive">{errors.password[0]}</p>
                  )}
                </div>
              </>
            )}
            {isEdit && (
              <div className="grid gap-2">
                <Label htmlFor="user-password-new">Nueva contraseña (opcional)</Label>
                <Input
                  id="user-password-new"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Dejar vacío para mantener"
                />
                <Input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                  placeholder="Confirmar nueva contraseña"
                />
                {errors.password?.[0] && (
                  <p className="text-xs text-destructive">{errors.password[0]}</p>
                )}
              </div>
            )}
            <div className="grid gap-2">
              <Label>Rol *</Label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
              </select>
              {errors.role?.[0] && (
                <p className="text-xs text-destructive">{errors.role[0]}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            {isEdit && !isSelf && (
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
            {isEdit && isSelf && (
              <p className="mr-auto text-xs text-muted-foreground">No podés eliminar tu propio usuario.</p>
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
