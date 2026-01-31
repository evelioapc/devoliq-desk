import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Pagination from '../../components/Pagination';
import ClientDialog from '../../components/ClientDialog';
import ClientDetailDialog from '../../components/ClientDetailDialog';
import ActionButtons from '../../components/ActionButtons';
import api from '../../lib/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Search, Users, Database, Loader2 } from "lucide-react";

export default function ClientsIndex() {
  const { t } = useTranslation();
  const { props } = usePage();
  const canSeedDemo = props.app?.canSeedDemo ?? false;
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [seeding, setSeeding] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/clients', { params: { q: q || undefined, page } });
      setResp(r.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, page]);

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await api.post('/seed-demo');
      await load();
    } finally {
      setSeeding(false);
    }
  };

  const lastPage = resp?.last_page ?? 1;
  const currentPage = resp?.current_page ?? 1;
  const isEmpty = !loading && (resp?.data || []).length === 0;
  const isEmptySearch = isEmpty && q !== '';

  return (
    <AppLayout>
      <Head title={t('clients.title')} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('clients.title')}</h2>
          <p className="text-muted-foreground">{t('clients.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {canSeedDemo && (
            <Button variant="outline" onClick={handleSeedDemo} disabled={seeding}>
              {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              {t('clients.loadDemo')}
            </Button>
          )}
          <Button onClick={() => setCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('clients.create')}
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('clients.search')}
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('clients.list')}</CardTitle>
          <CardDescription>{t('clients.listDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {isEmptySearch ? t('clients.emptySearch') : t('clients.empty')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                {isEmptySearch ? t('clients.searchHint') : t('clients.emptyHint')}
              </p>
              {!isEmptySearch && (
                <>
                  <Button onClick={() => setCreateOpen(true)} className="mb-3">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('clients.createFirst')}
                  </Button>
                  {canSeedDemo && (
                    <p className="text-xs text-muted-foreground">
                      Tip: también podés ejecutar <code className="bg-muted px-1 rounded">php artisan db:seed</code> en la terminal
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settings.name')}</TableHead>
                    <TableHead>{t('auth.email')}</TableHead>
                    <TableHead>{t('clients.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(resp?.data || []).map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? "default" : "secondary"}>
                          {client.status}
                        </Badge>
                      </TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => { setSelectedClient(client); setDetailOpen(true); }}
                            onEdit={() => { setSelectedClient(client); setEditOpen(true); }}
                            deleteUrl={`clients/${client.id}`}
                            deleteLabel={t('clients.deleteLabel', { name: client.name })}
                            onDeleted={load}
                          />
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {lastPage > 1 && (
                <Pagination
                  page={currentPage}
                  lastPage={lastPage}
                  onPage={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ClientDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={null}
        onSaved={load}
      />

      <ClientDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={selectedClient}
        onSaved={load}
      />

      <ClientDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        clientId={selectedClient?.id}
      />
    </AppLayout>
  );
}
