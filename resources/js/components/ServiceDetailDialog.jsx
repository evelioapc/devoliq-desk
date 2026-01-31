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
import { Loader2, Briefcase } from 'lucide-react';

export default function ServiceDetailDialog({ open, onOpenChange, serviceId }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && serviceId) {
      setLoading(true);
      api.get(`/services/${serviceId}`)
        .then((r) => setService(r.data))
        .catch(() => setService(null))
        .finally(() => setLoading(false));
    } else {
      setService(null);
    }
  }, [open, serviceId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del servicio</DialogTitle>
          <DialogDescription>Información del servicio.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : service ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>{service.status}</Badge>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Precio</dt>
                <dd>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(service.price)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Duración</dt>
                <dd>{service.duration_minutes ?? 0} minutos</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">No se pudo cargar.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
