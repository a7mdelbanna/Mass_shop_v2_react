import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { fetchAreas, fetchCities } from '@/services/address-service';
import { Area, City } from '@/types/address';

export type DeliveryFeeFormValues = {
  areaName: string;
  price: number;
  deliveryHours: number;
  deliveryMinutes: number;
  parentAreaId?: number | null;
};

const DeliveryFeeFormFields = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const form = useFormContext<DeliveryFeeFormValues>();
  const [cities, setCities] = React.useState<City[]>([]);
  const [loadingAreas, setLoadingAreas] = React.useState(false);

  React.useEffect(() => {
    setLoadingAreas(true);
    fetchCities()
      .then(setCities)
      .finally(() => setLoadingAreas(false));
  }, []);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="areaName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('areaName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterAreaName')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('price')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterPrice')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deliveryHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('deliveryHours')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterDeliveryHours')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deliveryMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('deliveryMinutes')}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t('enterDeliveryMinutes')} {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="parentAreaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('parentArea')}</FormLabel>
            <FormControl>
              <Select
                value={field.value ? String(field.value) : 'none'}
                onValueChange={val => field.onChange(val === 'none' ? null : Number(val))}
                disabled={loadingAreas}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('enterParentAreaId')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t('noParentArea') || 'No Parent Area'}
                  </SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {isRTL ? city.name : city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DeliveryFeeFormFields; 