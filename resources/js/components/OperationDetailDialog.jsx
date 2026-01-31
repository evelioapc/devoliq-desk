import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Loader2, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OperationDetailDialog({ open, onOpenChange, operationId }) {
  const [operation, setOperation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && operationId) {
      setLoading(true);
      api.get(`/operations/${operationId}`)
        .then((r) => setOperation(r.data))
        .catch(() => setOperation(null))
        .finally(() => setLoading(false));
    } else {
      setOperation(null);
    }
  }, [open, operationId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de la operación</DialogTitle>
          <DialogDescription>
            Información completa de la operación.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : operation ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(operation.amount)}
                </h3>
                <Badge variant={operation.status === 'done' ? 'default' : 'secondary'}>
                  {operation.status}
                </Badge>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Cliente</dt>
                <dd>{operation.client?.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Servicio</dt>
                <dd>{operation.service?.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fecha</dt>
                <dd>
                  {operation.performed_at
                    ? format(new Date(operation.performed_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })
                    : operation.created_at
                      ? format(new Date(operation.created_at), "d 'de' MMMM yyyy", { locale: es })
                      : '-'}
                </dd>
              </div>
              {operation.notes && (
                <div>
                  <dt className="text-muted-foreground">Notas</dt>
                  <dd className="whitespace-pre-wrap">{operation.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">No se pudo cargar la operación.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
