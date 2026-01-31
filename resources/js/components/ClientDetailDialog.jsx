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
import { Loader2, User } from 'lucide-react';

export default function ClientDetailDialog({ open, onOpenChange, clientId }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && clientId) {
      setLoading(true);
      api.get(`/clients/${clientId}`)
        .then((r) => setClient(r.data))
        .catch(() => setClient(null))
        .finally(() => setLoading(false));
    } else {
      setClient(null);
    }
  }, [open, clientId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del cliente</DialogTitle>
          <DialogDescription>
            Información completa del cliente.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : client ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              {client.email && (
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{client.email}</dd>
                </div>
              )}
              {client.phone && (
                <div>
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd>{client.phone}</dd>
                </div>
              )}
              {client.doc_id && (
                <div>
                  <dt className="text-muted-foreground">Documento / CUIT</dt>
                  <dd>{client.doc_id}</dd>
                </div>
              )}
              {client.address && (
                <div>
                  <dt className="text-muted-foreground">Dirección</dt>
                  <dd>{client.address}</dd>
                </div>
              )}
              {client.notes && (
                <div>
                  <dt className="text-muted-foreground">Notas</dt>
                  <dd className="whitespace-pre-wrap">{client.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">No se pudo cargar el cliente.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
