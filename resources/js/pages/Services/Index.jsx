import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Pagination from '../../components/Pagination';
import ServiceDialog from '../../components/ServiceDialog';
import ServiceDetailDialog from '../../components/ServiceDetailDialog';
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
import { PlusCircle, Search } from "lucide-react";

export default function ServicesIndex() {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/services', { params: { q: q || undefined, page } });
      setResp(r.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, page]);

  const lastPage = resp?.last_page ?? 1;
  const currentPage = resp?.current_page ?? 1;

  return (
    <AppLayout>
      <Head title={t('services.title')} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('services.title')}</h2>
          <p className="text-muted-foreground">{t('services.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => { setSelectedService(null); setDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('services.add')}
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('services.search')}
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
          <CardTitle>{t('services.list')}</CardTitle>
          <CardDescription>{t('services.listDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('services.name')}</TableHead>
                    <TableHead>{t('services.price')}</TableHead>
                    <TableHead>{t('clients.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(resp?.data || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        {t('services.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    (resp?.data || []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'active' ? "default" : "secondary"}>
                            {item.status === 'active' ? t('services.active') : t('services.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => { setSelectedService(item); setDetailOpen(true); }}
                            onEdit={() => { setSelectedService(item); setDialogOpen(true); }}
                            deleteUrl={`services/${item.id}`}
                            deleteLabel={t('services.deleteLabel', { name: item.name })}
                            onDeleted={load}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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

      <ServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={selectedService}
        onSaved={load}
      />

      <ServiceDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        serviceId={selectedService?.id}
      />
    </AppLayout>
  );
}
