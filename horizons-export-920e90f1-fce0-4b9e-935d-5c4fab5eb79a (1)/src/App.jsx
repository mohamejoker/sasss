import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import HomePage from '@/pages/HomePage';
import AdminPage from '@/pages/AdminPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLogin from '@/pages/admin/AdminLogin';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import ProductsPage from '@/pages/ProductsPage';
import OffersPage from '@/pages/OffersPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import UserDashboard from '@/pages/UserDashboard';
import NotFound from '@/components/NotFound';

const AppContent = () => {
  const { loading, siteSettings } = useAdmin();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{siteSettings.site_name || 'Kledje'} - متجر منتجات العناية الفاخرة</title>
        <meta name="description" content={`اكتشف مجموعة ${siteSettings.site_name || 'Kledje'} الفريدة من منتجات العناية الطبيعية عالية الجودة. كريمات ومنتجات طبيعية للعناية بالبشرة والشعر في مصر.`} />
        <meta name="keywords" content="kledje, كليدج, منتجات العناية, كريمات طبيعية, العناية بالبشرة, العناية بالشعر, مصر, جنيه مصري" />
        <meta property="og:title" content={`${siteSettings.site_name || 'Kledje'} - متجر منتجات العناية الفاخرة`} />
        <meta property="og:description" content={`اكتشف مجموعة ${siteSettings.site_name || 'Kledje'} الفريدة من منتجات العناية الطبيعية عالية الجودة`} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <WhatsAppButton />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AdminProvider>
          <Router>
            <AppContent />
          </Router>
        </AdminProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;