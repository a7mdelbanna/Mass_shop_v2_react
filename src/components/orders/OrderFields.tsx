import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type FormValues = {
  nameEn: string;
  nameAr: string;
  noteEN?: string;
  noteAR?: string;
};

const CompanyFormFields = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nameEn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name (English)</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name in English" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="nameAr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name (Arabic)</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name in Arabic" {...field}  />
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
            <FormLabel>Note (English)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter notes in English" 
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
            <FormLabel>Note (Arabic)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter notes in Arabic" 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
    </div>
  );
};

export default CompanyFormFields;
