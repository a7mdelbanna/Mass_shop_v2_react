import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Company } from '@/types/company';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

export interface FormValues {
  id: number;
  nameEN: string;
  nameAR: string;
  noteEN: string | null;
  noteAR: string | null;
  arrange: number;
  companyId: number;
}

interface CategoryFormFieldsProps {
  companies: Company[];
}

const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({ companies }) => {
  const form = useFormContext<FormValues>();
  const { t } = useTranslation();

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
              <Input placeholder={t('enterCategoryNameAR')} {...field} dir="rtl" />
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
                value={field.value || ''}
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
                value={field.value || ''}
                dir="rtl"
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
                min={0}
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

export default CategoryFormFields; 