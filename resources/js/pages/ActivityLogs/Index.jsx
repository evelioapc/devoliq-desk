import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import Pagination from '../../components/Pagination';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { es, pt, enUS } from "date-fns/locale";

const dateLocales = { es, pt, en: enUS };

export default function ActivityLogsIndex() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);

  const entityOptions = [
    { value: '', label: t('activityLogs.all') },
    { value: 'Client', label: t('nav.clients') },
    { value: 'Service', label: t('nav.services') },
    { value: 'Operation', label: t('nav.operations') },
    { value: 'Company', label: t('activityLogs.company') },
  ];
  const [entityType, setEntityType] = useState('');
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/activity-logs', {
        params: { page, entity_type: entityType || undefined },
      });
      setResp(r.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, entityType]);

  const lastPage = resp?.last_page ?? 1;
  const currentPage = resp?.current_page ?? 1;

  const formatTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const locale = dateLocales[i18n.language] ?? es;
    if (diffMs < 60000) return t('activityLogs.momentAgo');
    return formatDistanceToNow(date, { addSuffix: true, locale });
  };

  return (
    <AppLayout>
      <Head title={t('activityLogs.title')} />
      <div className="flex items-center justify-between space-y-2 mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('activityLogs.title')}</h2>
          <p className="text-muted-foreground">{t('activityLogs.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {entityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('activityLogs.history')}</CardTitle>
          <CardDescription>{t('activityLogs.historyDesc')}</CardDescription>
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
                    <TableHead>{t('activityLogs.action')}</TableHead>
                    <TableHead>{t('activityLogs.time')}</TableHead>
                    <TableHead className="text-right">{t('activityLogs.goTo')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(resp?.data || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No hay registros de actividad.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (resp?.data || []).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.description}</TableCell>
                        <TableCell className="text-muted-foreground text-sm" title={log.created_at}>
                          {formatTime(log.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          {log.route && log.entity_id && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={log.route}>{t('activityLogs.view')}</Link>
                            </Button>
                          )}
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
    </AppLayout>
  );
}
