import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Users, UserCircle, Truck, ChevronDown, BadgePercent, Tag, TicketPercent, Sun } from 'lucide-react';
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

export function DiscountsNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if the current path exactly matches the given path
  const isExactActive = (path: string) => location.pathname === path;

  // Check if the current path starts with the given path (for parent menu)
  const isParentActive = (path: string) => location.pathname.startsWith(path);

  // Effect to handle route changes and auto-expand when a subroute is active
  useEffect(() => {
    if (isParentActive('/dashboard/discounts/offers') || isParentActive('/dashboard/discounts/coupons')) {
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
          isActive={isParentActive('/dashboard/discounts')}
          tooltip={t('discountsAndOffers')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center">
            <BadgePercent className="h-5 w-5 mr-2" />
            <span>{t('discountsAndOffers')}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
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
                isActive={isExactActive('/dashboard/discounts/offers')}
              >
                <Link to="/dashboard/discounts/offers" className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{t('offers')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/discounts/spotlights')}
              >
                <Link to="/dashboard/discounts/spotlights" className="flex items-center">
                  <Sun className="h-4 w-4 mr-2" />
                  <span>{t('spotlights')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/discounts/coupons')}
              >
                <Link to="/dashboard/discounts/coupons" className="flex items-center">
                  <TicketPercent className="h-4 w-4 mr-2" />
                  <span>{t('coupons')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
