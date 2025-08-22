import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NotificationSettingDto } from '@/types/notification-setting';
import { fetchNotificationSetting, updateNotificationSetting } from '@/services/notification-setting-service';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
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
  autoNotifyWhenNegativeRating: z.boolean(),
  autoNotifyWhenReplacmentOrder: z.boolean(),
  autoNotifyWhenOrderArrived: z.boolean(),
  autoNotifyWhenOrderStatusChanged: z.boolean(),
  autoNotifyWhenAssignOrder: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const NotificationSettingsPage = () => {
  // Replace with actual storeId logic as needed
  const storeId = '1';
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      autoNotifyWhenNegativeRating: false,
      autoNotifyWhenReplacmentOrder: false,
      autoNotifyWhenOrderArrived: false,
      autoNotifyWhenOrderStatusChanged: false,
      autoNotifyWhenAssignOrder: false,
    },
  });

  const loadSettings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { setting } = await fetchNotificationSetting(storeId);
      form.reset(setting);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      sweetAlert.fire({ icon: 'error', title: t('failedToLoadSettings') });
    } finally {
      setIsLoading(false);
    }
  }, [form, storeId, t]);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);
      // Ensure all fields are present and not optional
      const dto: NotificationSettingDto = {
        autoNotifyWhenNegativeRating: data.autoNotifyWhenNegativeRating,
        autoNotifyWhenReplacmentOrder: data.autoNotifyWhenReplacmentOrder,
        autoNotifyWhenOrderArrived: data.autoNotifyWhenOrderArrived,
        autoNotifyWhenOrderStatusChanged: data.autoNotifyWhenOrderStatusChanged,
        autoNotifyWhenAssignOrder: data.autoNotifyWhenAssignOrder,
      };
      const { message } = await updateNotificationSetting(storeId, dto);
      sweetAlert.fire({ icon: 'success', title: message || t('settingsUpdatedSuccessfully') });
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      sweetAlert.fire({ icon: 'error', title: error?.message || t('failedToSaveSettings') });
    } finally {
      setIsSaving(false);
    }
  };

  const tabList = [
    { value: 'admin', label: t('forAdmin') },
    { value: 'customer', label: t('forCustomer') },
    { value: 'delivery', label: t('forDeliveryBoy') },
  ];
  const restTabs = tabList.slice(1);
  const orderedTabs = [tabList[0], ...(isRTL ? [...restTabs].reverse() : restTabs)];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('notificationSettings')}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="admin" dir={isRTL ? 'rtl' : 'ltr'}>
            <TabsList className="mb-4">
              {orderedTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="admin" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('forAdmin')}</CardTitle>
                  <CardDescription>{t('adminNotificationSettings')}</CardDescription>
                </CardHeader>
                <CardContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                  <FormField
                    control={form.control}
                    name="autoNotifyWhenNegativeRating"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('autoNotifyWhenNegativeRating')}</FormLabel>
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
            <TabsContent value="customer" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('forCustomer')}</CardTitle>
                  <CardDescription>{t('customerNotificationSettings')}</CardDescription>
                </CardHeader>
                <CardContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                  <FormField
                    control={form.control}
                    name="autoNotifyWhenReplacmentOrder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('autoNotifyWhenReplacmentOrder')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autoNotifyWhenOrderArrived"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('autoNotifyWhenOrderArrived')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autoNotifyWhenOrderStatusChanged"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('autoNotifyWhenOrderStatusChanged')}</FormLabel>
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
            <TabsContent value="delivery" className={isRTL ? 'rtl' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>{t('forDeliveryBoy')}</CardTitle>
                  <CardDescription>{t('deliveryBoyNotificationSettings')}</CardDescription>
                </CardHeader>
                <CardContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                  <FormField
                    control={form.control}
                    name="autoNotifyWhenAssignOrder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('autoNotifyWhenAssignOrder')}</FormLabel>
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

export default NotificationSettingsPage; 