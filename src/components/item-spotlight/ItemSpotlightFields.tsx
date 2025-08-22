import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ItemSpotlightAllForCreateUpdateDto } from '@/types/spotlight';
import { useTranslation } from 'react-i18next';

const ItemSpotlightFields: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const form = useFormContext<ItemSpotlightAllForCreateUpdateDto>();

  return (
    <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <FormField
        control={form.control}
        name="titleEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('titleEN')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterTitleEN')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="titleAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('titleAR')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterTitleAR')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="companyNameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('companyNameEN')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterCompanyNameEN')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="companyNameAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('companyNameAR')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterCompanyNameAR')} {...field} />
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
    </div>
  );
};

export default ItemSpotlightFields; 