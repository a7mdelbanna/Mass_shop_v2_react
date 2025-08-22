import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StoreSettings } from '@/types/store-settings';
import { storeSettingsService } from '@/services/store-settings-service';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { sweetAlert } from '@/utils/alert';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const formSchema = z.object({
  minOrdersForActivateReferralCode: z.number().min(0, 'Minimum orders must be positive'),
  minAmountForRechargeWallet: z.number().min(0, 'Minimum amount must be positive'),
  minAmountForPlaceOrder: z.number().min(0, 'Minimum amount for place order must be positive'),
  minItemsForPlaceOrder: z.number().min(0, 'Minimum items for place order must be positive'),
  totalAmountForActivateReferralCode: z.number().min(0, 'Total amount must be positive'),
  totalAmountForFreeDelivery: z.number().nullable(),
  isInventoryTracked: z.boolean(),
  deliveryFeeType: z.number().nullable().refine((val) => val === 1 || val === 2 || val === null, {
    message: 'Delivery fee type must be either 1 (By Area) or 2 (By Distance)'
  }),
  enableDelivery: z.boolean(),
  isAvailableToReceiveOrders: z.boolean(),
  enableDeliveryTips: z.boolean(),
  enableOrderRating: z.boolean(),
  // New fields
  pointsPerEGPSpent: z.number().nullable().optional(),
  egpPerPointRedeem: z.number().nullable().optional(),
  referralCashbackPercent: z.number().min(0, 'Must be positive'),
  referralCashbackMaxEGP: z.number().min(0, 'Must be positive'),
  inviteeDiscountMaxOrders: z.number().min(0, 'Must be positive'),
  inviteeDiscountPercent: z.number().min(0, 'Must be positive'),
  inviteeDiscountMaxEGP: z.number().min(0, 'Must be positive'),
  pointsExpiryDays: z.number().min(0, 'Must be positive'),
  redeemCouponExpiryDays: z.number().min(0, 'Must be positive'),
  redeemCouponUsageLimit: z.number().min(0, 'Must be positive'),
});

const StoreSettingsPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<StoreSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minOrdersForActivateReferralCode: 0,
      minAmountForRechargeWallet: 0,
      minAmountForPlaceOrder: 0,
      minItemsForPlaceOrder: 0,
      totalAmountForActivateReferralCode: 0,
      totalAmountForFreeDelivery: null,
      isInventoryTracked: false,
      deliveryFeeType: 1,
      enableDelivery: false,
      isAvailableToReceiveOrders: false,
      enableDeliveryTips: false,
      enableOrderRating: false,
      // New fields
      pointsPerEGPSpent: null,
      egpPerPointRedeem: null,
      referralCashbackPercent: 0,
      referralCashbackMaxEGP: 0,
      inviteeDiscountMaxOrders: 0,
      inviteeDiscountPercent: 0,
      inviteeDiscountMaxEGP: 0,
      pointsExpiryDays: 0,
      redeemCouponExpiryDays: 0,
      redeemCouponUsageLimit: 0,
    },
  });

  const loadSettings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const settings = await storeSettingsService.getSettings();
      form.reset(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadSettings') });
    } finally {
      setIsLoading(false);
    }
  }, [form, t]);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onSubmit = async (data: StoreSettings) => {
    console.log('Form submitted with data:', data);
    try {
      setIsSaving(true);
      await storeSettingsService.updateSettings(data);
      sweetAlert.fire({ icon: 'success', title: t('settingsUpdatedSuccessfully') });
    } catch (error) {
      console.error('Error saving settings:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToSaveSettings') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit, (errors) => {
    console.log('Form validation errors:', errors);
    sweetAlert.fire({ icon: 'error', title: 'Form validation failed', text: 'Please check the form fields.' });
  });

  const tabList = [
    { value: 'general', label: t('generalSettings') },
    { value: 'delivery', label: t('deliverySettings') },
    { value: 'order', label: t('orderSettings') },
    { value: 'inventory', label: t('inventorySettings') },
  ];
  const restTabs = tabList.slice(1);
  const orderedTabs = [tabList[0], ...(isRTL ? [...restTabs].reverse() : restTabs)];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('storeSettings')}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" dir={isRTL ? 'rtl' : 'ltr'}>
            <TabsList className="mb-4">
              {orderedTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="general" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('generalSettings')}</CardTitle>
                  <CardDescription>{t('generalSettingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className={`grid grid-cols-1 md:grid-cols-2 gap-6${isRTL ? ' rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {/* Existing fields */}
                
                 
                  {/* New fields */}
                  <FormField
                    control={form.control}
                    name="pointsPerEGPSpent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pointsPerEGPSpent')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="egpPerPointRedeem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('egpPerPointRedeem')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referralCashbackPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('referralCashbackPercent')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referralCashbackMaxEGP"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('referralCashbackMaxEGP')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inviteeDiscountMaxOrders"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inviteeDiscountMaxOrders')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inviteeDiscountPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inviteeDiscountPercent')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inviteeDiscountMaxEGP"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inviteeDiscountMaxEGP')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pointsExpiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pointsExpiryDays')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="redeemCouponExpiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('redeemCouponExpiryDays')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="redeemCouponUsageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('redeemCouponUsageLimit')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Existing fields continued */}
                  <FormField
                    control={form.control}
                    name="minOrdersForActivateReferralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('minOrdersForActivateReferralCode')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minAmountForRechargeWallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('minAmountForRechargeWallet')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalAmountForActivateReferralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('totalAmountForActivateReferralCode')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="delivery" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('deliverySettings')}</CardTitle>
                  <CardDescription>{t('deliverySettingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className={`grid grid-cols-1 md:grid-cols-2 gap-6${isRTL ? ' rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <FormField
                    control={form.control}
                    name="totalAmountForFreeDelivery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('totalAmountForFreeDelivery')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryFeeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('deliveryFeeType')}</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue>
                                {field.value === 1 ? t('byArea') : field.value === 2 ? t('byDistance') : t('selectDeliveryFeeType')}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">{t('byArea')}</SelectItem>
                            <SelectItem value="2">{t('byDistance')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="order" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('orderSettings')}</CardTitle>
                  <CardDescription>{t('orderSettingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className={`grid grid-cols-1 md:grid-cols-2 gap-6${isRTL ? ' rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <FormField
                    control={form.control}
                    name="minAmountForPlaceOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('minAmountForPlaceOrder')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minItemsForPlaceOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('minItemsForPlaceOrder')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enableDelivery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('enableDelivery')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAvailableToReceiveOrders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('isAvailableToReceiveOrders')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enableDeliveryTips"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('enableDeliveryTips')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enableOrderRating"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('enableOrderRating')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('inventorySettings')}</CardTitle>
                  <CardDescription>{t('inventorySettingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                  <FormField
                    control={form.control}
                    name="isInventoryTracked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('trackInventory')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('saving') : t('saveChanges')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StoreSettingsPage; 