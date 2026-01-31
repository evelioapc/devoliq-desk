import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from '@inertiajs/react';

export default function UpgradeModal({ open, onOpenChange, message }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('upgrade.title')}</DialogTitle>
          <DialogDescription>
            {message ?? t('upgrade.defaultMsg')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button asChild>
            <Link href="/billing">{t('upgrade.upgradePlan')}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
