import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Layers,
  CreditCard,
  Store,
  ChevronDown,
  Settings as SettingsIcon,
  Bell
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function SettingNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const isExactActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    if (isParentActive('/dashboard/settings')) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={toggleDropdown}
          isActive={isParentActive('/dashboard/settings')}
          tooltip={t('settings')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            <span>{t('settings')}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "transform rotate-180" : ""
            )}
          />
        </SidebarMenuButton>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/storeSettings')}
              >
                <Link to="/dashboard/storeSettings" className="flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  <span>{t('storeSettings')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/notificationSettings')}
              >
                <Link to="/dashboard/notificationSettings" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>{t('notificationSettings')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/paymentSettings')}
              >
                <Link to="/dashboard/paymentSettings" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>{t('paymentSettings')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
