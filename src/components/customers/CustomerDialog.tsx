import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Customer, CreateCustomerDto } from '@/types/customer';
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
import { CustomerService } from '@/services/customer-service';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  isNew: boolean;
  onSaveComplete: () => void;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onOpenChange,
  customer,
  isNew,
  onSaveComplete,
}) => {
  const { t } = useTranslation();
  const form = useForm<CreateCustomerDto>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phoneNumber: customer?.phoneNumber || '',
      password: '',
    },
  });

  const onSubmit = async (data: CreateCustomerDto) => {
    try {
      if (isNew) {
        await CustomerService.create(data);
        toast.success(t('customerCreatedSuccessfully'));
      }
      onSaveComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(t('failedToSaveCustomer'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? t('createCustomer') : t('editCustomer')}</DialogTitle>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
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

export default CustomerDialog; 