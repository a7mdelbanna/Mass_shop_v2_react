import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { authService } from '@/services/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  if (authService.isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !password) {
      setError(t('loginErrorRequired'));
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await authService.login({ phoneNumber, password });
      toast.success(t('loginSuccess'));
      navigate(from, { replace: true });
    } catch (err) {
      // Handle the specific error message from the API
      const errorMessage = err instanceof Error 
        ? err.message === 'The phone number OR password not correct'
          ? t('loginErrorInvalid')
          : err.message
        : t('loginFailed');
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000, // Show error for 4 seconds
        style: {
          background: 'hsl(var(--destructive))',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('loginPhoneNumber')}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('loginPhoneNumberPlaceholder')}
                required
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('loginPassword')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('loginPasswordPlaceholder')}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={toggleShowPassword}
                  title={showPassword ? t('loginHidePassword') : t('loginShowPassword')}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loginSigningIn')}
                  </>
                ) : (
                  t('loginSignIn')
                )}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t('loginNoAccount')} </span>
                <Link to="/register" className="text-primary hover:underline">
                  {t('loginRegisterHere')}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
