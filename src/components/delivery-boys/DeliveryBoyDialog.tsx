import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DeliveryBoy, CreateDeliveryBoyDto } from '@/types/delivery-boy';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { deliveryBoyService } from '@/services/delivery-boy-service';
import { useTranslation } from 'react-i18next';
import { sweetAlert } from '@/utils/alert';

interface DeliveryBoyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveryBoy: DeliveryBoy | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const DeliveryBoyDialog: React.FC<DeliveryBoyDialogProps> = ({
  open,
  onOpenChange,
  deliveryBoy,
  isNew,
  onSaveComplete,
}) => {
  const { t } = useTranslation();
  const formSchema = z.object({
    firstName: z.string().min(2, t('firstNameValidation')),
    lastName: z.string().min(2, t('lastNameValidation')),
    phoneNumber: z.string().min(10, t('phoneNumberValidation')),
    password: z.string()
      .min(8, t('passwordComplexityValidation'))
      .regex(/\d/, t('passwordComplexityValidation')),
  });

  const form = useForm<CreateDeliveryBoyDto>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: deliveryBoy?.firstName || '',
      lastName: deliveryBoy?.lastName || '',
      phoneNumber: deliveryBoy?.phoneNumber || '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (open && deliveryBoy && !isNew) {
      form.reset({
        firstName: deliveryBoy.firstName || '',
        lastName: deliveryBoy.lastName || '',
        phoneNumber: deliveryBoy.phoneNumber || '',
        password: '',
      });
    } else if (open && isNew) {
      form.reset({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
      });
    }
  }, [open, deliveryBoy, isNew, form]);

  const onSubmit = async (data: CreateDeliveryBoyDto) => {
    try {
      if (isNew) {
        await deliveryBoyService.create(data);
        await sweetAlert.fire({
          icon: 'success',
          title: t('deliveryBoyCreatedSuccessfully'),
        });
      }
      onSaveComplete();
      onOpenChange(false);
    } catch (error) {
      await sweetAlert.fire({
        icon: 'error',
        title: error,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? t('addDeliveryBoy') : t('editDeliveryBoy')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('firstName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('lastName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phoneNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isNew && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">
                {isNew ? t('create') : t('saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryBoyDialog; 