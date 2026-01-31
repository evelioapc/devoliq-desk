import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

/**
 * Botones de acción: Ver | Editar | Eliminar
 * - onView: abrir detalle
 * - onEdit: abrir edición
 * - onDelete: DELETE a la API (se usa deleteUrl)
 * - deleteUrl: ej. `/api/clients/${id}`
 * - deleteLabel: ej. "cliente", "Juan Pérez"
 * - showEdit, showDelete: mostrar botón (default true)
 * - disabledDelete: ej. no eliminar usuario propio
 */
export default function ActionButtons({
  onView,
  onEdit,
  deleteUrl,
  deleteLabel,
  onDeleted,
  showEdit = true,
  showDelete = true,
  disabledDelete = false,
}) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!deleteUrl) return;
    setError('');
    setDeleting(true);
    try {
      await api.delete(deleteUrl);
      setConfirmOpen(false);
      onDeleted?.();
    } catch (err) {
      setError(err.response?.data?.message || t('common.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {onView && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onView}
            title={t('common.viewDetails')}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && showEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
            title={t('common.edit')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {deleteUrl && showDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={disabledDelete}
            title={disabledDelete ? t('common.cannotDelete') : t('common.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('common.deleteConfirm', { label: deleteLabel })}</DialogTitle>
            <DialogDescription>{t('common.undoWarning')}</DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting || disabledDelete}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
