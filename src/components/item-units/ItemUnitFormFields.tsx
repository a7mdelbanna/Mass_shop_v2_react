import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export type FormValues = {
  nameEN: string;
  nameAR: string;
  amount: number;
};

const ItemUnitFormFields = () => {
  const form = useFormContext<FormValues>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  return (
    <>
      <FormField
        control={form.control}
        name="nameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('nameEN')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterUnitNameEN')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="nameAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('nameAR')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterUnitNameAR')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('amount')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('enterAmount')} 
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ItemUnitFormFields;
