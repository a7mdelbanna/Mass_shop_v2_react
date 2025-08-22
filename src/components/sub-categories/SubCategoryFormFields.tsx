import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MainCategory } from '@/types/main-category';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormValues {
  nameEN: string;
  nameAR: string;
  noteEN?: string;
  noteAR?: string;
  arrange: number;
  mainCategoryId: number;
}

interface SubCategoryFormFieldsProps {
  mainCategories: MainCategory[];
}

const SubCategoryFormFields: React.FC<SubCategoryFormFieldsProps> = ({ mainCategories }) => {
  const form = useFormContext<FormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="mainCategoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Category</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a main category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mainCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nameEN}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name (English)</FormLabel>
            <FormControl>
              <Input placeholder="Enter English name" {...field} />
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
            <FormLabel>Name (Arabic)</FormLabel>
            <FormControl>
              <Input placeholder="Enter Arabic name" {...field} dir="rtl" />
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
                placeholder="Enter English note" 
                {...field} 
                value={field.value || ''}
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
                placeholder="Enter Arabic note" 
                {...field} 
                value={field.value || ''}
                dir="rtl"
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
            <FormLabel>Display Order</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0}
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

export default SubCategoryFormFields; 