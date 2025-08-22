import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { couponFormSchema } from '@/schemas/couponSchema';
import CouponFormFields from './CouponFormFields';
import { Coupon, CouponForCreateDto, CouponForUpdateDto } from '@/types/coupon';
import { createCoupon, updateCoupon } from '@/services/coupon-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { sweetAlert } from '@/utils/alert';
import { Input } from '@/components/ui/input';
import { t } from 'i18next';

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  storeId: string;
  isNew: boolean;
  onSaveComplete: () => void;
}

const CouponDialog: React.FC<CouponDialogProps> = ({ open, onOpenChange, coupon, storeId, isNew, onSaveComplete }) => {
  const form = useForm<CouponForCreateDto | CouponForUpdateDto>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: coupon
      ? {
          code: coupon.code || '',
          description: coupon.description || '',
          discountType: typeof coupon.discountType === 'number' ? coupon.discountType : 0,
          discountValue: coupon.discountValue,
          startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : '',
          endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : '',
          status: coupon.status,
          maxUses: coupon.maxUses,
          perUserLimit: coupon.perUserLimit,
        }
      : {
          code: '',
          description: '',
          discountType: 0,
          discountValue: 0,
          startDate: '',
          endDate: '',
          status: true,
          maxUses: 1,
          perUserLimit: 1,
        },
  });

  React.useEffect(() => {
    if (coupon) {
      form.reset({
        code: coupon.code || '',
        description: coupon.description || '',
        discountType: typeof coupon.discountType === 'number' ? coupon.discountType : 0,
        discountValue: coupon.discountValue,
        startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : '',
        endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : '',
        status: coupon.status,
        maxUses: coupon.maxUses,
        perUserLimit: coupon.perUserLimit,
      });
    } else {
      form.reset({
        code: '',
        description: '',
        discountType: 0,
        discountValue: 0,
        startDate: '',
        endDate: '',
        status: true,
        maxUses: 1,
        perUserLimit: 1,
      });
    }
  }, [coupon, form]);

  const handleSubmit = async (values: CouponForCreateDto | CouponForUpdateDto) => {
    try {
      if (isNew) {
        const response = await createCoupon(storeId, values as CouponForCreateDto);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
      } else {
        const response = await updateCoupon(storeId, values as CouponForUpdateDto);
        await sweetAlert.fire({
          icon: 'success',
          title: response.result.message,
        });
      }
      onSaveComplete();
      onOpenChange(false);
    } catch (error) {
      // handle error, show toast, etc.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>{t(isNew ? 'createCoupon' : 'editCoupon')}</DialogTitle>
          <DialogDescription>
            {t(isNew ? 'createCouponDesc' : 'editCouponDesc')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('couponCode')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('couponCodePlaceholder')} disabled={!isNew} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <CouponFormFields />
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">{t(isNew ? 'create' : 'update')}</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDialog; 