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

export default function UserDetailDialog({ open, onOpenChange, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      api.get(`/users/${userId}`)
        .then((r) => setUser(r.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setUser(null);
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del usuario</DialogTitle>
          <DialogDescription>Información del usuario.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role}</Badge>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user.email}</dd>
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
