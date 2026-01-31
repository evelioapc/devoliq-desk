import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Mail } from 'lucide-react';

export default function SupportIndex() {
  const { t } = useTranslation();
  const supportEmail = 'soporte@devoliq.com';

  return (
    <AppLayout>
      <Head title={t('support.title')} />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('support.title')}</h2>
        <p className="text-muted-foreground">{t('support.subtitle')}</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-3">
              <Headphones className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>{t('support.contact')}</CardTitle>
              <CardDescription>{t('support.contactDesc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href={`mailto:${supportEmail}?subject=Consulta Devoliq Desk`}>
              <Mail className="mr-2 h-4 w-4" />
              {supportEmail}
            </a>
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
