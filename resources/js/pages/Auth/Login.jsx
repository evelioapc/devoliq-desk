import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import i18n from '@/lib/i18n';

export default function Login() {
  const { t } = useTranslation();
  const { locale } = usePage().props;

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title={t('auth.login')} />
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 md:right-8 md:top-8 flex gap-2 z-50">
          <Link href="/locale/es" className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-800">ES</Link>
          <Link href="/locale/pt" className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-800">PT</Link>
          <Link href="/locale/en" className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-800">EN</Link>
        </div>

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Layers className="mr-2 h-6 w-6" />
            Devoliq Desk
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('auth.login')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('auth.loginSubtitle')}
              </p>
            </div>
            <div className={cn("grid gap-6")}>
              <form onSubmit={submit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={processing}
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      disabled={processing}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('auth.remember')}
                    </label>
                  </div>
                  <Button disabled={processing} className="w-full">
                    {processing && (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {t('auth.enter')}
                  </Button>
                </div>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth.orContinueWith')}
                  </span>
                </div>
              </div>
              <Button variant="outline" disabled={processing} asChild>
                <Link href="/register">{t('auth.register')}</Link>
              </Button>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              {t('auth.agreeTerms')}{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.terms')}
              </Link>{" "}
              {t('auth.and')}{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.privacy')}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
