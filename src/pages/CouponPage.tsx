import React from 'react';
import { getAllCoupons, deleteCoupon } from '@/services/coupon-service';
import { Coupon } from '@/types/coupon';
import CouponDialog from '@/components/coupons/CouponDialog';
import CouponTable from '@/components/coupons/CouponTable';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const storeId = '1'; // Replace with dynamic storeId if needed

const CouponPage: React.FC = () => {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCoupon, setSelectedCoupon] = React.useState<Coupon | null>(null);
  const [selectedCouponCode, setSelectedCouponCode] = React.useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isNew, setIsNew] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { t } = useTranslation();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons(storeId);
      setCoupons(data ?? []);
    } catch (error) {
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadCoupons') });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = () => {
    setSelectedCoupon(null);
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
      setSelectedCoupon(coupon);
      setIsNew(false);
      setDialogOpen(true);
    }
  };

  const handleDelete = (code: string) => {
    setSelectedCouponCode(code);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCoupon(storeId, selectedCouponCode!);
      sweetAlert.fire({ icon: 'success', title: t('couponDeletedSuccessfully') });
      await fetchCoupons();
    } catch (error) {
      sweetAlert.fire({ icon: 'error', title: t('failedToDeleteCoupon') });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedCouponCode(null);
    }
  };

  const handleSaveComplete = () => {
    setDialogOpen(false);
    fetchCoupons();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className='card mb-xl-8'>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">{t('coupons')}</span>
            <span className="text-muted mt-1 fw-semibold fs-7">{t('manageCoupons')}</span>
          </h3>
          <div className="card-toolbar" title={t('addCouponTooltip')}>
            <Button onClick={handleCreate} className="btn btn-sm btn-light btn-active-primary text-white">
              <i className="ki-duotone ki-plus fs-2 text-white"></i>{t('addCoupon')}
            </Button>
          </div>
        </div>
        <div className='card-body pt-3'>
          <div className="table-responsive">
            <CouponTable
              coupons={coupons}
              isLoading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <CouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={selectedCoupon}
        storeId={storeId}
        isNew={isNew}
        onSaveComplete={handleSaveComplete}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setSelectedCouponCode(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCoupon')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCouponConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCouponCode(null);
              }}
              disabled={isDeleting}
            >
              {t('cancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleting') : t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CouponPage; 