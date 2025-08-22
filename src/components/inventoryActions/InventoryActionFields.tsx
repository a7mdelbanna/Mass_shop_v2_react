import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Action } from '@/types/inventory';
import { useTranslation } from 'react-i18next';

export type FormValues = {
  stockVal: number;
  itemId: number;
  action: number;
};

const InventoryActionFormFields = () => {
  const form = useFormContext<FormValues>();
  const { t } = useTranslation();
  const action = [
    { label: t('restocked'), value: Action.Restocked },
    { label: t('returned'), value: Action.Returned },
    { label: t('sold'), value: Action.Sold },
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="itemId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterProductId')} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stockVal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('quantity')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterStockAmount')} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="action"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('actionType')}</FormLabel>
            <Select value={String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                {action.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
};

export default InventoryActionFormFields;
