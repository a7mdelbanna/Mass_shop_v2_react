import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export type FormValues = {
  nameEN: string;
  nameAR: string;
  emoji: string;
  color: string;
};

const TagFormFields = () => {
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
              <Input placeholder={t('enterTagNameEN')} {...field} />
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
              <Input placeholder={t('enterTagNameAR')} {...field}  />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="emoji"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('emoji')}</FormLabel>
            <FormControl>
               <Input placeholder={t('enterEmoji')} {...field}  />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('color')}</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input 
                  type="color" 
                  className="w-12 h-12 p-1 rounded cursor-pointer"
                  {...field} 
                />
                <Input 
                  type="text" 
                  placeholder={t('enterColorCode')} 
                  value={field.value}
                  onChange={field.onChange}
                  className="flex-1"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
     
    </div>
  );
};

export default TagFormFields; 