import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import DeliveryFeeByDistanceFormFields, { DeliveryFeeByDistanceFormValues } from './DeliveryFeeByDistanceFormFields';
import { useTranslation } from 'react-i18next';
import { createDeliveryFeeByDistance, updateDeliveryFeeByDistance } from '@/services/delivery-fee-service';
import { DeliveryFeeByDistanceForUpdateDto } from '@/types/delivery-fee';

const formSchema = z.object({
  from: z.number().min(0, { message: 'From distance must be 0 or greater' }),
  to: z.number().min(0, { message: 'To distance must be 0 or greater' }),
  price: z.number().min(0, { message: 'Price must be 0 or greater' }),
  deliveryHours: z.number().min(0, { message: 'Delivery hours must be 0 or greater' }),
  deliveryMinutes: z.number().min(0, { message: 'Delivery minutes must be 0 or greater' }),
});

interface DeliveryFeeByDistanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  fee: DeliveryFeeByDistanceFormValues | null;
  isNew: boolean;
  onSaveComplete: () => void;
  feeId?: number;
}

const DeliveryFeeByDistanceDialog: React.FC<DeliveryFeeByDistanceDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  fee,
  isNew,
  onSaveComplete,
  feeId,
}) => {
  const { t } = useTranslation();
  const form = useForm<DeliveryFeeByDistanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: fee || {
      from: 0,
      to: 0,
      price: 0,
      deliveryHours: 0,
      deliveryMinutes: 0,
    },
  });

  React.useEffect(() => {
    if (fee) {
      form.reset(fee);
    } else {
      form.reset({
        from: 0,
        to: 0,
        price: 0,
        deliveryHours: 0,
        deliveryMinutes: 0,
      });
    }
  }, [fee, form]);

  const handleSubmit = async (values: DeliveryFeeByDistanceFormValues) => {
    try {
      if (isNew) {
        await createDeliveryFeeByDistance(storeId, values);
        toast.success(t('deliveryFeeCreated'));
      } else {
        if (!feeId) {
          throw new Error('Fee ID is required for update');
        }
        const updateDto: DeliveryFeeByDistanceForUpdateDto = {
          ...values,
          id: feeId
        };
        await updateDeliveryFeeByDistance(storeId, updateDto);
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
              <DeliveryFeeByDistanceFormFields />
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

export default DeliveryFeeByDistanceDialog; 