import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/lib/supabaseClient';
import { formatPrice } from '@/utils/formatters';

const DashboardOverview = () => {
  const { products, offers } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData);
          
          // Calculate stats
          const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
          const uniqueCustomers = new Set(ordersData.map(order => order.customer_info.email)).size;
          
          setStats({
            totalRevenue,
            totalOrders: ordersData.length,
            totalCustomers: uniqueCustomers,
            conversionRate: 12.5 // Mock conversion rate
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'إجمالي المبيعات',
      value: formatPrice(stats.totalRevenue),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'إجمالي العملاء',
      value: stats.totalCustomers.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'معدل التحويل',
      value: `${stats.conversionRate}%`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم! 👋</h1>
            <p className="text-pink-100">
              إليك نظرة سريعة على أداء متجرك اليوم
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-pink-100">اليوم</p>
              <p className="text-2xl font-bold">{new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        {stat.value}
                      </p>
                      <div className={`flex items-center mt-2 text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendIcon className="w-4 h-4 ml-1" />
                        {stat.change}
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Package className="w-4 h-4 ml-2" />
                إضافة منتج جديد
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Eye className="w-4 h-4 ml-2" />
                عرض الطلبات الجديدة
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 ml-2" />
                إنشاء عرض جديد
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 ml-2" />
                جدولة تقرير
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>أحدث الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_info.firstName} {order.customer_info.lastName}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatPrice(order.total)}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'shipped' ? 'secondary' :
                          order.status === 'processing' ? 'outline' : 'destructive'
                        }>
                          {order.status === 'placed' && 'جديد'}
                          {order.status === 'processing' && 'قيد التجهيز'}
                          {order.status === 'shipped' && 'تم الشحن'}
                          {order.status === 'delivered' && 'تم التوصيل'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    لا توجد طلبات بعد
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Products & Offers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>ملخص المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>إجمالي المنتجات</span>
                  <span className="font-bold">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>منتجات متوفرة</span>
                  <span className="font-bold text-green-600">
                    {products.filter(p => p.in_stock).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>منتجات مميزة</span>
                  <span className="font-bold text-blue-600">
                    {products.filter(p => p.featured).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>منتجات بخصم</span>
                  <span className="font-bold text-orange-600">
                    {products.filter(p => p.discount > 0).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>ملخص العروض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>إجمالي العروض</span>
                  <span className="font-bold">{offers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>عروض نشطة</span>
                  <span className="font-bold text-green-600">
                    {offers.filter(o => o.active).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>عروض منتهية</span>
                  <span className="font-bold text-red-600">
                    {offers.filter(o => !o.active).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>متوسط الخصم</span>
                  <span className="font-bold text-purple-600">
                    {offers.length > 0 
                      ? Math.round(offers.reduce((sum, o) => sum + o.discount, 0) / offers.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;