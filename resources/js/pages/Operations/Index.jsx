import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Pagination from '../../components/Pagination';
import OperationCreateDialog from '../../components/OperationCreateDialog';
import OperationDetailDialog from '../../components/OperationDetailDialog';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Activity } from "lucide-react";
import { format } from "date-fns";

export default function OperationsIndex() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [date, setDate] = useState('');
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOperationId, setSelectedOperationId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const params = { page };
      if (date) {
        params.from = date;
        params.to = date;
      }
      const r = await api.get('/operations', { params });
      setResp(r.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [date, page]);

  const lastPage = resp?.last_page ?? 1;
  const currentPage = resp?.current_page ?? 1;
  const isEmpty = !loading && (resp?.data || []).length === 0;

  return (
    <AppLayout>
      <Head title={t('operations.title')} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('operations.title')}</h2>
          <p className="text-muted-foreground">{t('operations.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('operations.new')}
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4 gap-4">
        <div className="relative">
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setPage(1);
              setDate(e.target.value);
            }}
            className="w-[180px]"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('operations.list')}</CardTitle>
          <CardDescription>{t('operations.listDesc')}</CardDescription>
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
                <Activity className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('operations.empty')}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">{t('operations.emptyHint')}</p>
              <Button onClick={() => setCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('operations.new')}
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('operations.client')}</TableHead>
                    <TableHead>{t('operations.service')}</TableHead>
                    <TableHead>{t('operations.amount')}</TableHead>
                    <TableHead>{t('operations.date')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(resp?.data || []).map((op) => (
                      <TableRow key={op.id}>
                        <TableCell className="font-medium">{op.client?.name || '-'}</TableCell>
                        <TableCell>{op.service?.name || '-'}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(op.amount)}
                        </TableCell>
                        <TableCell>
                          {op.created_at ? format(new Date(op.created_at), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => { setSelectedOperationId(op.id); setDetailOpen(true); }}
                            showEdit={false}
                            deleteUrl={`operations/${op.id}`}
                            deleteLabel={t('operations.deleteLabel')}
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

      <OperationCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={load}
      />

      <OperationDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        operationId={selectedOperationId}
      />
    </AppLayout>
  );
}
