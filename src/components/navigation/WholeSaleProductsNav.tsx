import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Package, Layers, Tag, Bell, Scale, ChevronDown, ShoppingCart } from 'lucide-react';
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

export function WholeSaleProductsNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if the current path exactly matches the given path
  const isExactActive = (path: string) => location.pathname === path;
  
  // Check if the current path starts with the given path (for parent menu)
  const isParentActive = (path: string) => location.pathname.startsWith(path);

  // Effect to handle route changes and auto-expand when a subroute is active
  useEffect(() => {
    if (isParentActive('/dashboard/products')) {
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
          isActive={isParentActive('/dashboard/products')}
          tooltip={t('products')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>{t('products')}</span>
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
                isActive={isExactActive('/dashboard/products')}
              >
                <Link to="/dashboard/products" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{t('allProducts')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/products/item-units')}
              >
                <Link to="/dashboard/products/item-units" className="flex items-center">
                  <Scale className="h-4 w-4 mr-2" />
                  <span>{t('units')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/products/categories/main')}
              >
                <Link to="/dashboard/products/categories" className="flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  <span>{t('categories')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/products/companies')}
              >
                <Link to="/dashboard/products/companies" className="flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  <span>{t('companies')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/products/tags')}
              >
                <Link to="/dashboard/products/tags" className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{t('tags')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={isExactActive('/dashboard/products/notices')}
              >
                <Link to="/dashboard/products/notices" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>{t('notices')}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
