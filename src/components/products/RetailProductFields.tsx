import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RetailProduct } from '@/types/product';


const RetailProductFormFields = () => {
  const form = useFormContext<RetailProduct>();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name (English)</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name in English" {...field} />
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
            <FormLabel>Product Name (Arabic)</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name in Arabic" {...field}  />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="descriptionEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (English)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter description in English" 
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
        name="descriptionAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Arabic)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter description in Arabic" 
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

export default RetailProductFormFields;
