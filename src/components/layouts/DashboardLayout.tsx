import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth-service';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LogOut, User, Home, Package, ShoppingCart,
  Users, Settings, Menu, Search, Bell,
  LayoutDashboard,
  MapPin,
  MessageCircleWarning,
  ClipboardList,
  Truck,
  DollarSign
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ProductsNav } from '@/components/navigation/ProductsNav';
import { WholeSaleProductsNav } from '@/components/navigation/WholeSaleProductsNav';
import { SettingNav } from '@/components/navigation/SettingNav';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UsersNav } from '../navigation/UsersNav';
import { DiscountsNav } from '../navigation/DiscountsNav';
import { InventoryNav } from '../navigation/InventoryNav';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';



export const DashboardLayout: React.FC = () => {

  const user = authService.getUser();
  const isSystemAdmin = user?.userType == 'SystemAdmin';
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Navigate user to login if not authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const { settings } = useStoreSettings();

  if (!settings) {
    return <div className="p-6 text-muted-foreground">{t('loadingStoreSetting')}</div>;
  }

  // Extract appMode
  const appMode = settings.appMode;
  const isInventoryTracked = settings.isInventoryTracked;

  const isRetail = appMode === 'RetailMarket';
  const isWholeSale = appMode === 'WholeSale';
  const isBoth = appMode === 'Both';

  let navContent;

  if (isSystemAdmin) {
    navContent = (
      // Put your System Admin navigation here
      <SidebarMenu>
        {/* Example: */}
        <SidebarMenuItem>
          <SidebarMenuButton isActive={location.pathname === '/dashboard/admin'}>
            <Link to="/dashboard/admin" className="flex items-center w-full">
              {/* ...icon and label... */}
              <span>Admin Panel</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      // Add more as needed
    );
  } else {
    navContent = (
      <>
        {isRetail ? <ProductsNav /> : <WholeSaleProductsNav />}
        <SidebarMenu>
          {[
            { id: 'orders', title: t('orders'), icon: ClipboardList, url: '/dashboard/orders' },
          ].map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton isActive={location.pathname === item.url}>
                <Link to={item.url} className="flex items-center w-full">
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {isInventoryTracked ? <InventoryNav /> : null}
        <DiscountsNav />
        <UsersNav />
        <SidebarMenu>
          {[
            { id: 'complaints', title: t('complaints'), icon: MessageCircleWarning, url: '/dashboard/complaints' },
          ].map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton isActive={location.pathname === item.url}>
                <Link to={item.url} className="flex items-center w-full">
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
          {[
            { id: 'deliveryFee', title: t('deliveryFee'), icon: DollarSign, url: '/dashboard/deliveryFees' },
          ].map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton isActive={location.pathname === item.url}>
                <Link to={item.url} className="flex items-center w-full">
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
          {[
            { id: 'address', title: t('address'), icon: MapPin, url: '/dashboard/storeAddress' },
          ].map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton isActive={location.pathname === item.url}>
                <Link to={item.url} className="flex items-center w-full">
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SettingNav />
      </>
    );
  }

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return t('dashboard');
    if (path === '/dashboard/products') return t('products');
    if (path === '/dashboard/products/item-units') return t('itemUnits');
    if (path === '/dashboard/products/categories/main') return t('mainCategories');
    if (path === '/dashboard/products/categories/sub') return t('subCategories');
    if (path === '/dashboard/discounts/offers') return t('offers');
    if (path === '/dashboard/orders') return t('orders');
    if (path === '/dashboard/customers') return t('customers');
    if (path === '/dashboard/deliveryBoys') return t('deliveryBoys');
    if (path === '/dashboard/settings') return t('settings');
    if (path === '/dashboard/storeAddress') return t('storeAddress');
    if (path === '/dashboard/storeSettings') return t('storeSettings');
    if (path === '/dashboard/notificationSettings') return t('notificationSettings');
    if (path === '/dashboard/paymentSettings') return t('paymentSettings');
    return t('dashboard');
  };


  /*return (

      <div className="d-flex">
        <SidebarMetronic />
        <div className="flex-grow-1">
          <Outlet />
        </div>
      </div>

  );
}*/

  return (
    <SidebarProvider>
      <div
        className={`
          min-h-screen
          grid
          grid-cols-[auto_90rem]
        `}
      >
        {/* Sidebar */}
        <Sidebar
          variant="floating"
          side={isRTL ? 'right' : 'left'}
          className="h-screen"
          style={{ width: '16rem', minWidth: '16rem', maxWidth: '16rem' }}
        >
          <SidebarHeader className={`flex flex-col items-center justify-center py-4 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">M</span>
              </div>
              <div className="text-center">
                <h1 className="text-base font-bold text-primary">MasDB</h1>
                <p className="text-xs text-muted-foreground">Store Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className={isRTL ? 'text-right' : 'text-left'}>{t('main')}</SidebarGroupLabel>
              <SidebarGroupContent>
                {navContent}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {authService.getUser()?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{authService.getUser()?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {authService.getUser()?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoggingOut ? t('loggingOut') : t('logOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  <p className="font-medium">{authService.getUser()?.name}</p>
                  <p className="text-xs text-muted-foreground">{authService.getUser()?.email}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full flex items-center justify-center"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <LogOut className="mr-2 h-4 w-4 animate-spin" />
                    {t('loggingOut')}
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </>
                )}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="min-h-screen w-full flex flex-col">
          <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <h1 className="text-lg font-semibold hidden md:block">
                {getPageTitle()}
              </h1>
            </div>

            <div className="hidden md:flex items-center w-full max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  className="pl-9 h-9 md:w-[300px] lg:w-[400px] bg-slate-50 dark:bg-slate-800 border-0 ring-1 ring-slate-200 dark:ring-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-2 py-1 rounded text-sm border transition-colors ${i18n.language === 'en' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage('ar')}
                  className={`px-2 py-1 rounded text-sm border transition-colors ${i18n.language === 'ar' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}
                >
                  العربية
                </button>
              </div>

              {isMobile ? (
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {authService.getUser()?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full hover:bg-destructive/90 ml-2"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <LogOut className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('logOut')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
