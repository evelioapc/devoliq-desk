import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Pagination from '../../components/Pagination';
import UserDialog from '../../components/UserDialog';
import UserDetailDialog from '../../components/UserDetailDialog';
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";

export default function UsersIndex() {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const currentUserId = auth?.user?.id;
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/users', { params: { q: q || undefined, page } });
      setResp(r.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, page]);

  const lastPage = resp?.last_page ?? 1;
  const currentPage = resp?.current_page ?? 1;

  return (
    <AppLayout>
      <Head title={t('users.title')} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('users.title')}</h2>
          <p className="text-muted-foreground">{t('users.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => { setSelectedUser(null); setDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('users.invite')}
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('users.search')}
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('users.list')}</CardTitle>
          <CardDescription>{t('users.listDesc')}</CardDescription>
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
                    <TableHead>{t('settings.name')}</TableHead>
                    <TableHead>{t('auth.email')}</TableHead>
                    <TableHead>{t('users.role')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(resp?.data || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        {t('users.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    (resp?.data || []).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? "destructive" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => { setSelectedUser(user); setDetailOpen(true); }}
                            onEdit={() => { setSelectedUser(user); setDialogOpen(true); }}
                            deleteUrl={`users/${user.id}`}
                            deleteLabel={t('users.deleteLabel', { name: user.name })}
                            onDeleted={load}
                            disabledDelete={Number(user.id) === Number(currentUserId)}
                          />
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

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={selectedUser}
        currentUserId={currentUserId}
        onSaved={load}
      />

      <UserDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        userId={selectedUser?.id}
      />
    </AppLayout>
  );
}
