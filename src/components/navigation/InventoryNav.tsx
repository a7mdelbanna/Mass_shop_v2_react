import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Layers,
  CreditCard,
  Store,
  ChevronDown,
  Settings as SettingsIcon,
  Box,
  Package
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

export function InventoryNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const isExactActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    if (isParentActive('/dashboard/inventory')) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarMenu>
    {[
      { id: 'inventory', title: t('inventory'), icon: Package  , url: '/dashboard/inventory' },
    ].map((item) => (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          isActive={location.pathname === item.url}
        >
          <Link to={item.url} className="flex items-center w-full">
            <item.icon className="mr-2 h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
  );
}
