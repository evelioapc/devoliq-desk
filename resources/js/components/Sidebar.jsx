import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Layers,
    Activity,
    CreditCard,
    UserCog,
    ShieldCheck,
    Menu
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const NavItem = ({ href, icon: Icon, children, active }) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
            active
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-muted"
        )}
    >
        <Icon className="h-4 w-4" />
        {children}
    </Link>
);

export function Sidebar({ className }) {
    const { t } = useTranslation();
    const { url, props } = usePage();
    const user = props.auth?.user;
    const isAdmin = user?.role === 'admin';

    return (
        <div className={cn("flex flex-col h-full border-r bg-muted/40", className)}>
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Layers className="h-6 w-6" />
                    <span className="">Devoliq Desk</span>
                </Link>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8 lg:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4 space-y-1">
                    <NavItem href="/" icon={LayoutDashboard} active={url === '/'}>
                        {t('nav.dashboard')}
                    </NavItem>
                    <NavItem href="/clients" icon={Users} active={url.startsWith('/clients')}>
                        {t('nav.clients')}
                    </NavItem>
                    <NavItem href="/services" icon={Briefcase} active={url.startsWith('/services')}>
                        {t('nav.services')}
                    </NavItem>
                    <NavItem href="/operations" icon={Activity} active={url.startsWith('/operations')}>
                        {t('nav.operations')}
                    </NavItem>
                    <NavItem href="/activity-logs" icon={ShieldCheck} active={url.startsWith('/activity-logs')}>
                        {t('nav.activityLogs')}
                    </NavItem>

                    {isAdmin && (
                        <>
                            <div className="mt-4 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {t('nav.admin')}
                            </div>
                            <NavItem href="/users" icon={UserCog} active={url.startsWith('/users')}>
                                {t('nav.users')}
                            </NavItem>
                            <NavItem href="/billing" icon={CreditCard} active={url.startsWith('/billing')}>
                                {t('nav.billing')}
                            </NavItem>
                        </>
                    )}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <div className="flex items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                    <div className='flex flex-col w-full'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className="text-sm font-semibold">{user?.company?.name}</span>
                            <Badge variant={user?.company?.plan === 'pro' ? 'default' : 'secondary'} className="capitalize">
                                {user?.company?.plan}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground truncate">{user?.name}</span>
                          <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">
                            {user?.role === 'admin' ? 'Admin' : 'Operator'}
                          </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <Sidebar className="border-r-0 bg-transparent" />
            </SheetContent>
        </Sheet>
    )
}
