import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { registerAdmin } from '@/services/auth-service';
import { toast } from 'sonner';
import { RegisterAdminRequest } from '@/types/auth';
import { useTranslation } from 'react-i18next';

const registerSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
  storeName: z.string().min(1, 'Store name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userName: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
});

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const form = useForm<RegisterAdminRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      licenseKey: '',
      storeName: '',
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      email: '',
      phoneNumber: '',
      phone1: '',
      phone2: '',
    },
  });

  const onSubmit = async (data: RegisterAdminRequest) => {
    try {
      setIsLoading(true);
      await registerAdmin(data);
      toast.success(t('registerSuccess'));
      navigate('/login');
    } catch (error) {
      // Error is already handled in the service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{t('registerTitle')}</CardTitle>
          <CardDescription>{t('registerDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="licenseKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerLicenseKey')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerLicenseKeyPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerStoreName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerStoreNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerFirstName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerFirstNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerLastName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerLastNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerUsername')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerUsernamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('registerPasswordPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerEmail')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('registerEmailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerPhoneNumber')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerPhoneNumberPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerPhone1')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerPhone1Placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registerPhone2')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('registerPhone2Placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  disabled={isLoading}
                >
                  {t('registerBackToLogin')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('registerRegister')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register; 