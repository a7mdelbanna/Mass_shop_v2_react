import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Users, UserCircle, Truck, ChevronDown } from 'lucide-react';
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

export function UsersNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // Check if the current path exactly matches the given path
  const isExactActive = (path: string) => location.pathname === path;
  
  // Check if the current path starts with the given path (for parent menu)
  const isParentActive = (path: string) => location.pathname.startsWith(path);

  // Effect to handle route changes and auto-expand when a subroute is active
  useEffect(() => {
    if (isParentActive('/dashboard/users/customers') || isParentActive('/dashboard/users/delivery-boys')) {
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
          isActive={isParentActive('/dashboard/users')}
          tooltip={t('users')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <span>{t('users')}</span>
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
                isActive={isExactActive('/dashboard/users/customers')}
              >
                <Link to="/dashboard/users/customers" className="flex items-center">
                  <UserCircle className="h-4 w-4 mr-2" />
                  <span>{t('customers')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/users/delivery-boys')}
              >
                <Link to="/dashboard/users/delivery-boys" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>{t('deliveryBoys')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
