import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ItemUnitDashboard from "@/pages/ItemUnitDashboard";
import MainCategoriesPage from "@/pages/MainCategoriesPage";
import SubCategoriesPage from "@/pages/SubCategoriesPage";
import StoreSettings from "@/pages/StoreSettingsPage";
import NotFound from "./pages/NotFound";
import TagsPage from "./pages/TagsPage";
import NoticesPage from "./pages/NoticesPage";
import DeliveryBoysPage from "@/pages/DeliveryBoysPage";
import CustomersPage from "./pages/CustomersPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import CompanyPage from "./pages/CompanyPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryActionsPage from "./pages/InventoryActionsPage";
import StoreAddressPage from "./pages/StoreAddressPage";
import OrdersPage from "./pages/OrdersPage";
import ItemOffersPage from "./pages/ItemOffersPage";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ItemSpotlightsPage from "./pages/ItemSpotlightsPage";
import OfferItemsPage from "./pages/OfferItemsPage";
import SpotlightItemsPage from "./pages/SpotlightItemsPage";
import DeliveryFeePage from "./pages/DeliveryFeePage";
import CategoryPage from "./pages/CategoryPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import CouponPage from "./pages/CouponPage";

function AppContent() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className={isRTL ? 'font-arabic' : ''}>
      {/* App Content */}
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Dashboard routes - protected by AuthProvider in DashboardLayout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/item-units" element={<ItemUnitDashboard />} />
            <Route path="products/categories/main" element={<MainCategoriesPage />} />
            <Route path="products/categories/sub" element={<SubCategoriesPage />} />
            <Route path="products/categories" element={<CategoryPage />} />
            <Route path="products/tags" element={<TagsPage />} />
            <Route path="products/notices" element={<NoticesPage />} />
            <Route path="products/companies" element={<CompanyPage />} />
            <Route path="discounts/offers" element={<ItemOffersPage />} />
            <Route path="discounts/spotlights" element={<ItemSpotlightsPage />} />
            <Route path="discounts/coupons" element={<CouponPage />} />
            <Route path="offers/:id/items" element={<OfferItemsPage />} />
            <Route path="spotlights/:id/items" element={<SpotlightItemsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users/delivery-boys" element={<DeliveryBoysPage />} />
            <Route path="users/customers" element={<CustomersPage />} />
            <Route path="inventory" element={<InventoryActionsPage />} />
            <Route path="deliveryFees" element={<DeliveryFeePage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="storeAddress" element={<StoreAddressPage />} />
            <Route path="storeSettings" element={<StoreSettings />} />
            <Route path="notificationSettings" element={<NotificationSettingsPage />} />
          </Route>
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
