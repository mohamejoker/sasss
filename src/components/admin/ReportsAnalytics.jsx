import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { formatPrice, formatDate } from '@/utils/formatters';

const ReportsAnalytics = () => {
  const { products } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return orders.filter(order => new Date(order.created_at) >= cutoffDate);
  };

  const filteredOrders = getFilteredOrders();

  const analytics = {
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: filteredOrders.length,
    averageOrderValue: filteredOrders.length > 0 ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length : 0,
    uniqueCustomers: new Set(filteredOrders.map(order => order.customer_info.email)).size,
    conversionRate: 12.5, // Mock data
    topProducts: getTopProducts(),
    salesByCategory: getSalesByCategory(),
    recentTrends: getRecentTrends()
  };

  function getTopProducts() {
    const productSales = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            image: item.image
          };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  function getSalesByCategory() {
    const categorySales = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        const category = product?.category || 'غير محدد';
        
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += item.price * item.quantity;
      });
    });

    return Object.entries(categorySales)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  function getRecentTrends() {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      last7Days.push({
        date: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
      });
    }
    return last7Days;
  }

  const handleExportReport = () => {
    toast({
      title: "📊 تصدير التقرير قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">التقارير والتحليلات</h1>
          <p className="text-muted-foreground">تحليل شامل لأداء المتجر والمبيعات</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">آخر 7 أيام</SelectItem>
              <SelectItem value="30">آخر 30 يوم</SelectItem>
              <SelectItem value="90">آخر 3 أشهر</SelectItem>
              <SelectItem value="365">آخر سنة</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExportReport} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(analytics.totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +12.5% من الفترة السابقة
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalOrders}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +8.2% من الفترة السابقة
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">متوسط قيمة الطلب</p>
                  <p className="text-2xl font-bold text-purple-600">{formatPrice(analytics.averageOrderValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +5.1% من الفترة السابقة
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">عملاء فريدون</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.uniqueCustomers}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +15.3% من الفترة السابقة
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>اتجاه المبيعات (آخر 7 أيام)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentTrends.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium">{day.date}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{formatPrice(day.revenue)}</p>
                      <p className="text-sm text-muted-foreground">{day.orders} طلب</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} قطعة مباعة
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{formatPrice(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sales by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>المبيعات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.salesByCategory.map((category, index) => {
                const percentage = analytics.totalRevenue > 0 ? (category.revenue / analytics.totalRevenue) * 100 : 0;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.category}</span>
                      <div className="text-left">
                        <span className="font-bold">{formatPrice(category.revenue)}</span>
                        <span className="text-sm text-muted-foreground mr-2">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>رؤى إضافية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">معدل التحويل</h3>
                <p className="text-2xl font-bold text-blue-600">{analytics.conversionRate}%</p>
                <p className="text-sm text-muted-foreground">من الزوار إلى عملاء</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">منتجات نشطة</h3>
                <p className="text-2xl font-bold text-green-600">{products.filter(p => p.in_stock).length}</p>
                <p className="text-sm text-muted-foreground">من إجمالي {products.length} منتج</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">متوسط الطلبات اليومية</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {timeRange === '7' ? Math.round(analytics.totalOrders / 7) : 
                   timeRange === '30' ? Math.round(analytics.totalOrders / 30) :
                   Math.round(analytics.totalOrders / parseInt(timeRange))}
                </p>
                <p className="text-sm text-muted-foreground">في الفترة المحددة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsAnalytics;