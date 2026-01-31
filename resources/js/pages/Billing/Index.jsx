import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import api from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Loader2, Infinity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BillingIndex() {
  const { t } = useTranslation();
  const { auth, usage = {}, limits = {} } = usePage().props;
  const company = auth?.user?.company;
  const [plan, setPlan] = useState(company?.plan ?? 'free');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const usageData = {
    clients: usage.clients ?? 0,
    clientsLimit: usage.clients_limit,
    opsThisMonth: usage.ops_this_month ?? 0,
    opsLimit: usage.ops_limit,
  };

  const handleSetPlan = (newPlan) => {
    setSaving(true);
    setMessage('');
    api.post('/billing/plan', { plan: newPlan })
      .then(() => {
        setPlan(newPlan);
        setMessage(t('billing.planUpdated'));
      })
      .catch((err) => setMessage(err.response?.data?.message || t('billing.planError')))
      .finally(() => setSaving(false));
  };

  const plans = useMemo(() => [
    {
      id: 'free',
      name: t('billing.free'),
      price: '$0',
      description: t('billing.freeDesc'),
      features: [t('billing.freeFeatures.clients'), t('billing.freeFeatures.ops'), t('billing.freeFeatures.support'), t('billing.freeFeatures.users')],
      limits: { clients: 50, ops: 200 },
    },
    {
      id: 'pro',
      name: t('billing.pro'),
      price: '$29',
      description: t('billing.proDesc'),
      features: [t('billing.proFeatures.clients'), t('billing.proFeatures.ops'), t('billing.proFeatures.support'), t('billing.proFeatures.users'), t('billing.proFeatures.reports')],
      limits: { clients: null, ops: null },
    },
  ], [t]);

  return (
    <AppLayout>
      <Head title={t('billing.title')} />
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('billing.title')}</h2>
          <p className="text-muted-foreground">{t('billing.subtitle')}</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('billing.currentUsage')}</CardTitle>
          <CardDescription>
            {t('billing.usageDesc', { plan: plan === 'pro' ? t('billing.pro') : t('billing.free') })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">{t('billing.clients')}</p>
                <p className="text-2xl font-bold">{usageData.clients}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {usageData.clientsLimit != null ? (
                  <span>{usageData.clients}/{usageData.clientsLimit}</span>
                ) : (
                  <span className="flex items-center gap-1"><Infinity className="h-4 w-4" /> {t('billing.unlimited')}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">{t('billing.opsThisMonth')}</p>
                <p className="text-2xl font-bold">{usageData.opsThisMonth}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {usageData.opsLimit != null ? (
                  <span>{usageData.opsThisMonth}/{usageData.opsLimit}</span>
                ) : (
                  <span className="flex items-center gap-1"><Infinity className="h-4 w-4" /> {t('billing.unlimited')}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <div className="mb-6 rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
        {plans.map((p) => (
          <Card key={p.id} className={cn("flex flex-col", plan === p.id && "border-primary ring-1 ring-primary")}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </div>
                {plan === p.id && (
                  <Badge variant="default">{t('billing.currentPlan')}</Badge>
                )}
              </div>
              <div className="mt-4 flex items-baseline text-3xl font-bold">
                {p.price}
                <span className="ml-1 text-sm font-medium text-muted-foreground">{t('billing.perMonth')}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {p.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan === p.id ? "outline" : "default"}
                onClick={() => handleSetPlan(p.id)}
                disabled={saving || plan === p.id}
              >
                {saving && plan !== p.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {plan === p.id ? t('billing.currentPlan') : t('billing.upgradeTo', { plan: p.name })}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('billing.history')}</CardTitle>
            <CardDescription>{t('billing.historyDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <CreditCard className="h-10 w-10 mb-4 opacity-20" />
              <p>{t('billing.noInvoices')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
