import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

export type FormValues = {
  nameEN: string;
  nameAR: string;
  noteEN: string;
  noteAR: string;
  arrange: number;
};

const MainCategoryFormFields = () => {
  const { t } = useTranslation();
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('nameEN')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterCategoryNameEN')} {...field} />
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
              <Input placeholder={t('enterCategoryNameAR')} {...field}  />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="noteEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('noteEN')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterCategoryNoteEN')} 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="noteAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('noteAR')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterCategoryNoteAR')} 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="arrange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('displayOrder')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('enterDisplayOrder')} 
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MainCategoryFormFields; 