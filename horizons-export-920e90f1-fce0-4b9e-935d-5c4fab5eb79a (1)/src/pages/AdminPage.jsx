import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductsTab from '@/components/admin/ProductsTab';
import OffersTab from '@/components/admin/OffersTab';
import SettingsTab from '@/components/admin/SettingsTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';

const AdminPage = () => {
  return (
    <>
      <Helmet>
        <title>لوحة التحكم - Kledje</title>
        <meta name="description" content="لوحة تحكم إدارة متجر Kledje" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-fuchsia-900/20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text">لوحة التحكم</h1>
              <p className="text-muted-foreground mt-2">إدارة المتجر والمنتجات والعروض</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                <ArrowLeft className="w-4 h-4" />
                <span>العودة للمتجر</span>
              </Button>
            </Link>
          </motion.div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">المنتجات</TabsTrigger>
              <TabsTrigger value="offers">العروض</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
              <TabsTrigger value="analytics">الإحصائيات</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="offers">
              <OffersTab />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminPage;