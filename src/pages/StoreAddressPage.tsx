import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getStoreAddress, createShopAddressByArea, createShopAddressByDistance, fetchAreas, fetchCities, confirmAddressLocation } from '@/services/address-service'; // adjust import paths
import { sweetAlert } from '@/utils/alert';
import { Area, City, ShopAddressByArea } from '@/types/address';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchItemUnits } from '@/services/item-unit-service';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const formSchema = z.object({
  addressName: z.string().min(1, "Address name is required"),
  street: z.string().min(1, "Street is required"),
  areaId: z.number(),
  cityId: z.number().min(1, "City is required"),
  locationLat: z.number().optional(),
  locationLong: z.number().optional(),
});

type AddressFormValues = z.infer<typeof formSchema>;

const GOOGLE_MAPS_API_KEY = 'AIzaSyAZMBbkSaeToLx3NZSodPA0NP7YmrG24mg';
const mapContainerStyle = { width: '100%', height: '300px' };
const defaultCenter = { lat: 30.0131, lng: 31.2089 }; // Giza, Cairo

const AddressPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [mapPosition, setMapPosition] = React.useState<{ lat: number; lng: number } | null>(null);
  const [addressId, setAddressId] = React.useState<number | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressName: '',
      areaId: 0,
      cityId: 0,
      street: '',
    },
  });

  // Load Google Maps script
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  React.useEffect(() => {
    const loadAddress = async () => {
      try {
        setIsLoading(true);
        const areas = await fetchAreas();
        const cities = await fetchCities();
        const address = await getStoreAddress();
        setAreas(areas);
        setCities(cities);
        form.reset({
          addressName: address.addressName,
          street: address.street,
          areaId: address.areaId,
          cityId: address.cityId,
          locationLat: address.locationLat ? Number(address.locationLat) : undefined,
          locationLong: address.locationLong ? Number(address.locationLong) : undefined,
        });
        setAddressId(Number(address.id));
        if (address.locationLat && address.locationLong) {
          setMapPosition({
            lat: Number(address.locationLat),
            lng: Number(address.locationLong),
          });
        }
      } catch (error) {
        console.error('Failed to load address', error);
        sweetAlert.fire({ icon: 'error', title: t('failedToLoadAddress') });
      } finally {
        setIsLoading(false);
      }
    };
    loadAddress();
  }, [form, t]);

  const handleMapClick = (e: any) => {
    if (e && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMapPosition({ lat, lng });
      form.setValue('locationLat', lat);
      form.setValue('locationLong', lng);
    }
  };

  const handleConfirmLocation = async () => {
    if (!addressId || !mapPosition) return;
    try {
      await confirmAddressLocation(addressId, mapPosition.lat, mapPosition.lng, form.getValues('addressName'));
      sweetAlert.fire({ icon: 'success', title: t('locationConfirmed') });
    } catch (error: any) {
      sweetAlert.fire({ icon: 'error', title: error?.message || t('failedToConfirmLocation') });
    }
  };

  const onSubmit = async (data: ShopAddressByArea) => {
    try {
      setIsSaving(true);
      await createShopAddressByArea(data);
      sweetAlert.fire({ icon: 'success', title: t('addressSavedSuccessfully') });
    } catch (error: any) {
      console.error('Failed to save address', error);
      sweetAlert.fire({ icon: 'error', title: error?.message || t('failedToSaveAddress') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('storeSettings')}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="grid grid-cols-1 gap-6 w-full">
            {/* First Card: Address Fields and Save Button */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{t('editStoreAddress')}</CardTitle>
                <CardDescription>{t('updateStoreAddressDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 w-full">
                <FormField
                  control={form.control}
                  name="addressName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addressName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('mainStorePlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('street')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('streetPlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('city')}</FormLabel>
                      <Select value={String(field.value)} onValueChange={val => field.onChange(Number(val))}>
                        <FormControl>
                          <SelectTrigger className={isRTL ? 'text-right' : ''} style={isRTL ? { direction: 'rtl' } : {}}>
                            <SelectValue placeholder={t('selectCity')} className={isRTL ? 'text-right' : ''} style={isRTL ? { direction: 'rtl' } : {}} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={isRTL ? 'text-right' : ''} style={isRTL ? { direction: 'rtl' } : {}}>
                          {cities.map((u: City) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="areaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('area')}</FormLabel>
                      <Select value={String(field.value)} onValueChange={val => field.onChange(Number(val))}>
                        <FormControl>
                          <SelectTrigger className={isRTL ? 'text-right' : ''} style={isRTL ? { direction: 'rtl' } : {}}>
                            <SelectValue placeholder={t('selectArea')} className={isRTL ? 'text-right' : ''} style={isRTL ? { direction: 'rtl' } : {}} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={isRTL ? 'text-right' : ''} style={isRTL ? { direction: 'rtl' } : {}}>
                          {areas.map((u: Area) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <div className="flex justify-start px-6 pb-6">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? t('saving') : t('saveAddress')}
                </Button>
              </div>
            </Card>

            {/* Second Card: Map and Confirm Location */}
            {isLoaded && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{t('selectLocationOnMap')}</CardTitle>
                  <CardDescription>{t('selectLocationOnMapDesc') || ''}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="col-span-full">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapPosition || defaultCenter}
                      zoom={mapPosition ? 16 : 10}
                      onClick={handleMapClick}
                    >
                      {mapPosition && <Marker position={mapPosition} />}
                    </GoogleMap>
                    <div className="mt-2 flex gap-2 items-center">

                      {(!addressId) && (
                        <span className="text-xs text-warning-foreground">{t('saveAddressFirst')}</span>
                      )}
                      {mapPosition && (
                        <span className="text-xs text-muted-foreground">{t('lat')}: {mapPosition.lat}, {t('lng')}: {mapPosition.lng}</span>
                      )}
                    </div>
                    <div className="flex justify-start mt-3 px-6 pb-6">
                      <Button type="button" onClick={handleConfirmLocation} disabled={!mapPosition || !addressId}>
                        {t('confirmLocation')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
      </Form>
    </div >
  );
};

export default AddressPage;
