import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManagement from '@/components/admin/ProductsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import OffersManagement from '@/components/admin/OffersManagement';
import CustomersManagement from '@/components/admin/CustomersManagement';
import InventoryManagement from '@/components/admin/InventoryManagement';
import ReportsAnalytics from '@/components/admin/ReportsAnalytics';
import SiteSettings from '@/components/admin/SiteSettings';
import LiveCustomizer from '@/components/admin/LiveCustomizer';
import NotificationCenter from '@/components/admin/NotificationCenter';
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <Helmet>
        <title>لوحة التحكم الإدارية - Kledje</title>
        <meta name="description" content="لوحة تحكم شاملة لإدارة متجر Kledje" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:mr-64' : 'lg:mr-16'}`}>
          <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/products" element={<ProductsManagement />} />
                <Route path="/orders" element={<OrdersManagement />} />
                <Route path="/offers" element={<OffersManagement />} />
                <Route path="/customers" element={<CustomersManagement />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/reports" element={<ReportsAnalytics />} />
                <Route path="/analytics" element={<AdvancedAnalytics />} />
                <Route path="/customizer" element={<LiveCustomizer />} />
                <Route path="/notifications" element={<NotificationCenter />} />
                <Route path="/settings" element={<SiteSettings />} />
              </Routes>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;