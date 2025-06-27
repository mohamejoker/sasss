
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { formatPrice, formatDate } from '@/utils/formatters';

const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    revenue: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    products: { current: 0, previous: 0, change: 0 }
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const ranges = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      
      const days = ranges[timeRange];
      const currentStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const previousStart = new Date(currentStart.getTime() - days * 24 * 60 * 60 * 1000);

      // Fetch current period data
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', currentStart.toISOString());

      if (currentError) throw currentError;

      // Fetch previous period data
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', currentStart.toISOString());

      if (previousError) throw previousError;

      // Calculate metrics
      const currentRevenue = currentOrders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
      const previousRevenue = previousOrders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
      const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const currentOrdersCount = currentOrders?.length || 0;
      const previousOrdersCount = previousOrders?.length || 0;
      const ordersChange = previousOrdersCount > 0 ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100 : 0;

      // Get unique customers
      const currentCustomers = new Set(currentOrders?.map(o => o.customer_info?.email)).size;
      const previousCustomers = new Set(previousOrders?.map(o => o.customer_info?.email)).size;
      const customersChange = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0;

      // Get products data
      const { data: products } = await supabase.from('products').select('*');
      const productsCount = products?.length || 0;

      setAnalytics({
        revenue: { current: currentRevenue, previous: previousRevenue, change: revenueChange },
        orders: { current: currentOrdersCount, previous: previousOrdersCount, change: ordersChange },
        customers: { current: currentCustomers, previous: previousCustomers, change: customersChange },
        products: { current: productsCount, previous: productsCount, change: 0 }
      });

      // Calculate top products
      const productSales = {};
      currentOrders?.forEach(order => {
        order.items?.forEach(item => {
          if (productSales[item.name]) {
            productSales[item.name].quantity += item.quantity;
            productSales[item.name].revenue += item.price * item.quantity;
          } else {
            productSales[item.name] = {
              name: item.name,
              quantity: item.quantity,
              revenue: item.price * item.quantity,
              image: item.image
            };
          }
        });
      });

      const sortedProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(sortedProducts);
      setRecentOrders(currentOrders?.slice(0, 10) || []);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "خطأ في تحميل التحليلات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      analytics,
      topProducts,
      recentOrders,
      exportDate: new Date().toISOString(),
      timeRange
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم تصدير البيانات",
      description: "تم تحميل ملف التحليلات بنجاح"
    });
  };

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">
                {format === 'currency' ? formatPrice(value) : value.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                ) : change < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-600 ml-1" />
                ) : null}
                <span className={`text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                </span>
              </div>
            </div>
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">التحليلات المتقدمة</h2>
          <p className="text-muted-foreground">تحليل شامل لأداء المتجر والمبيعات</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 أيام</SelectItem>
              <SelectItem value="30d">30 يوم</SelectItem>
              <SelectItem value="90d">90 يوم</SelectItem>
              <SelectItem value="1y">سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="إجمالي الإيرادات"
          value={analytics.revenue.current}
          change={analytics.revenue.change}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="عدد الطلبات"
          value={analytics.orders.current}
          change={analytics.orders.change}
          icon={ShoppingCart}
        />
        <MetricCard
          title="العملاء الجدد"
          value={analytics.customers.current}
          change={analytics.customers.change}
          icon={Users}
        />
        <MetricCard
          title="إجمالي المنتجات"
          value={analytics.products.current}
          change={analytics.products.change}
          icon={Package}
        />
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">أفضل المنتجات</TabsTrigger>
          <TabsTrigger value="orders">الطلبات الحديثة</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} قطعة مباعة
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatPrice(product.revenue)}</p>
                        <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد بيانات مبيعات</h3>
                  <p className="text-muted-foreground">ستظهر بيانات المنتجات الأكثر مبيعاً هنا</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الحديثة</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">#{order.id.slice(0, 8)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_info?.name || 'عميل'} • {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatPrice(order.total)}</p>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status === 'placed' && 'تم الاستلام'}
                          {order.status === 'processing' && 'قيد التجهيز'}
                          {order.status === 'shipped' && 'تم الشحن'}
                          {order.status === 'delivered' && 'تم التوصيل'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground">ستظهر الطلبات الحديثة هنا</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>اتجاهات الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">نمو الإيرادات</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>الفترة الحالية</span>
                      <span className="font-bold">{formatPrice(analytics.revenue.current)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>الفترة السابقة</span>
                      <span>{formatPrice(analytics.revenue.previous)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (analytics.revenue.current / Math.max(analytics.revenue.previous, analytics.revenue.current)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">نمو الطلبات</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>الفترة الحالية</span>
                      <span className="font-bold">{analytics.orders.current}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>الفترة السابقة</span>
                      <span>{analytics.orders.previous}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (analytics.orders.current / Math.max(analytics.orders.previous, analytics.orders.current)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
