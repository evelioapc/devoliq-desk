import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../layouts/AppLayout';
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
import { Activity, Users, DollarSign, Briefcase } from "lucide-react";
import { format } from "date-fns";
export default function Dashboard() {
  const { t } = useTranslation();
  const { props } = usePage();
  const summary = props.summary ?? null;
  const topServices = props.topServices ?? [];
  const latestOperations = props.latestOperations ?? [];
  const period = summary?.period ?? '30';

  const setPeriod = (p) => {
    router.get('/', { period: p }, { preserveState: true });
  };

  return (
    <AppLayout>
      <Head title={t('dashboard.title')} />
      <div className="flex items-center justify-between space-y-2 flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
        <div className="flex gap-2">
          {['7', '30', '90'].map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {t('dashboard.lastDays', { n: p })}
            </Button>
          ))}
        </div>
      </div>

      {summary ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.revenue')}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(summary.revenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.periodSelected')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.operations')}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.ops_count}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.inPeriod')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.newClients')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.clients_new}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.inPeriod')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.topServices')}</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topServices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.byRevenue')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.topServices')}</CardTitle>
                <CardDescription>{t('dashboard.topServicesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {topServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    {t('dashboard.noOpsInPeriod')}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('operations.service')}</TableHead>
                        <TableHead className="text-right">Ops</TableHead>
                        <TableHead className="text-right">{t('dashboard.revenue')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topServices.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="text-right">{s.ops_count}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(s.revenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('dashboard.latestOps')}</CardTitle>
                  <CardDescription>{t('dashboard.latestOpsDesc')}</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/operations">{t('dashboard.viewAll')}</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {latestOperations.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    {t('dashboard.noOps')}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('operations.client')}</TableHead>
                        <TableHead>{t('operations.service')}</TableHead>
                        <TableHead className="text-right">{t('operations.amount')}</TableHead>
                        <TableHead>{t('operations.date')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestOperations.map((op) => (
                        <TableRow key={op.id}>
                          <TableCell className="font-medium">{op.client}</TableCell>
                          <TableCell>{op.service}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(op.amount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {op.performed_at ? format(new Date(op.performed_at), 'd MMM yyyy') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed mt-6">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">{t('dashboard.noData')}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {t('dashboard.noDataHint')}
            </p>
            <Button asChild>
              <Link href="/operations">{t('dashboard.goToOps')}</Link>
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
