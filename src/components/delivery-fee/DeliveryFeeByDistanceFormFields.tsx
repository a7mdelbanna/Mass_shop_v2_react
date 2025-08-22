import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export type DeliveryFeeByDistanceFormValues = {
  from: number;
  to: number;
  price: number;
  deliveryHours: number;
  deliveryMinutes: number;
};

const DeliveryFeeByDistanceFormFields = () => {
  const { t } = useTranslation();
  const form = useFormContext<DeliveryFeeByDistanceFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="from"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('fromDistance')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterFromDistance')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="to"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('toDistance')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterToDistance')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('price')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterPrice')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deliveryHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('deliveryHours')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterDeliveryHours')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deliveryMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('deliveryMinutes')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterDeliveryMinutes')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DeliveryFeeByDistanceFormFields; 