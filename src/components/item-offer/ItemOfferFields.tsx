import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ItemOfferForCreateUpdateDto } from '@/types/offer';
import { useTranslation } from 'react-i18next';

const ItemOfferFields: React.FC = () => {
  const { t } = useTranslation();
  const form = useFormContext<ItemOfferForCreateUpdateDto>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('nameEN')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterOfferNameEN')} {...field} />
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
              <Input placeholder={t('enterOfferNameAR')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t('from')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value?.split('T')[0] || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toDate"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t('to')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value?.split('T')[0] || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="isSpecialOffer"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormLabel>{t('special')}</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ItemOfferFields; 