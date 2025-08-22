import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DiscountType } from '@/types/coupon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

const CouponFormFields = () => {
  const form = useFormContext();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('description')}</FormLabel>
          <FormControl><Input {...field} placeholder={t('description')} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="discountType" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('discountType')}</FormLabel>
          <Select value={String(field.value)} onValueChange={val => field.onChange(Number(val))}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={String(DiscountType.Percentage)}>{t('percentage')}</SelectItem>
              <SelectItem value={String(DiscountType.FixedAmount)}>{t('fixedAmount')}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="discountValue" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('discountValue')}</FormLabel>
          <FormControl><Input type="number" {...field} placeholder={t('discountValue')} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="startDate" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('startDate')}</FormLabel>
          <FormControl><Input type="date" {...field} placeholder={t('startDate')} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="endDate" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('endDate')}</FormLabel>
          <FormControl><Input type="date" {...field} placeholder={t('endDate')} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="maxUses" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('maxUses')}</FormLabel>
          <FormControl><Input type="number" {...field} placeholder={t('maxUses')} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="perUserLimit" render={({ field }) => (
        <FormItem>
          <FormLabel>{t('perUserLimit')}</FormLabel>
          <FormControl><Input type="number" {...field} placeholder={t('perUserLimit')} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="status" render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel>{t('status')}</FormLabel>
          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
};

export default CouponFormFields; 