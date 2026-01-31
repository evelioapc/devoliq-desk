import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { CircleUser } from 'lucide-react';
import i18n from '@/lib/i18n';

import UpgradeModal from '@/components/UpgradeModal';
import { Sidebar, MobileSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function AppLayout({ children }) {
  const { t } = useTranslation();
  const { auth, locale } = usePage().props;
  const user = auth?.user;
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState('');

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  useEffect(() => {
    function handler(e) {
      setUpgradeMsg(e?.detail?.message || t('upgrade.defaultMsg'));
      setUpgradeOpen(true);
    }
    window.addEventListener('plan-limit', handler);
    return () => window.removeEventListener('plan-limit', handler);
  }, [t]);

  function logout() {
    router.post('/logout');
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar className="border-r-0 bg-transparent" />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />
          <div className="w-full flex-1">
            {/* Keeping it simple for now, can add search later or breadcrumbs */}
            {/* <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">{t('nav.settings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support">{t('nav.support')}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>{t('nav.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        message={upgradeMsg}
      />
    </div>
  );
}
