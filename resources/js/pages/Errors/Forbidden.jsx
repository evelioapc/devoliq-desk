import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';

export default function Forbidden() {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <Head title={t('errors.forbidden')} />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-6 mb-6">
          <ShieldAlert className="h-16 w-16 text-amber-600 dark:text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t('errors.forbidden')}</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          {t('errors.forbiddenDesc')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('errors.backToDashboard')}
        </Link>
      </div>
    </AppLayout>
  );
}
