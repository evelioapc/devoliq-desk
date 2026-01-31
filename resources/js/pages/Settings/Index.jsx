import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import api from '../../lib/api';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Languages } from 'lucide-react';

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
];

export default function SettingsIndex() {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const user = auth?.user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    password_confirmation: '',
    locale: user?.locale ?? 'es',
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name ?? '',
        email: user.email ?? '',
        locale: user.locale ?? 'es',
      }));
    }
  }, [user?.id, user?.name, user?.email, user?.locale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, locale: form.locale };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await api.patch('/me', payload);
      setForm((f) => ({ ...f, password: '', password_confirmation: '' }));
      setSuccess(t('settings.saved'));
      i18n.changeLanguage(form.locale);
      router.reload(); // Refresca para que el sidebar y demás usen el nuevo locale
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || err.response?.data?.errors?.name?.[0] || t('settings.error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head title={t('settings.title')} />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-md">
        {/* Idioma */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3">
                <Languages className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>{t('settings.language')}</CardTitle>
                <CardDescription>{t('settings.languageDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <select
              value={form.locale}
              onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>{t('settings.profile')}</CardTitle>
                <CardDescription>{t('settings.profileDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <div className="grid gap-2">
                <Label htmlFor="name">{t('settings.name')}</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('settings.newPassword')}</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={t('settings.newPasswordPlaceholder')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">{t('auth.confirmPassword')}</Label>
                <Input id="password_confirmation" type="password" value={form.password_confirmation} onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))} placeholder={t('settings.confirmPasswordPlaceholder')} />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('settings.saveChanges')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
