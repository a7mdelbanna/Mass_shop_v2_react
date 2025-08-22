import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import DeliveryFeeFormFields, { DeliveryFeeFormValues } from './DeliveryFeeFormFields';
import { useTranslation } from 'react-i18next';
import { createDeliveryFeeByMainArea, createDeliveryFeeBySubArea, updateDeliveryFeeByArea } from '@/services/delivery-fee-service';
import { DeliveryFeeBySubAreaForUpdateDto } from '@/types/delivery-fee';

const formSchema = z.object({
  areaName: z.string().min(2, { message: 'Area name must be at least 2 characters' }),
  price: z.number().min(0, { message: 'Price must be 0 or greater' }),
  deliveryHours: z.number().min(0, { message: 'Delivery hours must be 0 or greater' }),
  deliveryMinutes: z.number().min(0, { message: 'Delivery minutes must be 0 or greater' }),
  parentAreaId: z.number().nullable().optional(),
});

interface DeliveryFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  fee: DeliveryFeeFormValues | null;
  isNew: boolean;
  onSaveComplete: () => void;
  feeId?: number;
}

const DeliveryFeeDialog: React.FC<DeliveryFeeDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  fee,
  isNew,
  onSaveComplete,
  feeId,
}) => {
  const { t } = useTranslation();
  const form = useForm<DeliveryFeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: fee || {
      areaName: '',
      price: 0,
      deliveryHours: 0,
      deliveryMinutes: 0,
      parentAreaId: null,
    },
  });

  React.useEffect(() => {
    if (fee) {
      form.reset(fee);
    } else {
      form.reset({
        areaName: '',
        price: 0,
        deliveryHours: 0,
        deliveryMinutes: 0,
        parentAreaId: null,
      });
    }
  }, [fee, form]);

  const handleSubmit = async (values: DeliveryFeeFormValues) => {
    try {
      if (isNew) {
        if (values.parentAreaId) {
          await createDeliveryFeeBySubArea(storeId, values);
        } else {
          await createDeliveryFeeByMainArea(storeId, values);
        }
        toast.success(t('deliveryFeeCreated'));
      } else {
        if (!feeId) {
          throw new Error('Fee ID is required for update');
        }
        const updateDto: DeliveryFeeBySubAreaForUpdateDto = {
          ...values,
          id: feeId
        };
        await updateDeliveryFeeByArea(storeId, updateDto);
        toast.success(t('deliveryFeeUpdated'));
      }
      onSaveComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error(t('failedToSaveDeliveryFee'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] my-4 flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle>{isNew ? t('createDeliveryFee') : t('editDeliveryFee')}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <DeliveryFeeFormFields />
            </form>
          </Form>
        </div>
        <div className="flex-none border-t pt-4 mt-4 px-6">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
              {isNew ? t('create') : t('update')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryFeeDialog; 