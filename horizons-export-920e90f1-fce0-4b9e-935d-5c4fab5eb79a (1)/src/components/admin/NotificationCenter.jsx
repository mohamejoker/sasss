
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, AlertCircle, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { formatDate } from '@/utils/formatters';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    setupRealtimeSubscription();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Simulate notifications from orders and system events
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', false);

      if (productsError) throw productsError;

      const notificationsList = [];

      // Add order notifications
      orders?.forEach(order => {
        notificationsList.push({
          id: `order-${order.id}`,
          type: 'order',
          title: 'طلب جديد',
          message: `طلب جديد بقيمة ${order.total} جنيه من ${order.customer_info?.name || 'عميل'}`,
          timestamp: order.created_at,
          read: false,
          icon: ShoppingBag,
          color: 'text-blue-600'
        });
      });

      // Add low stock notifications
      products?.forEach(product => {
        notificationsList.push({
          id: `stock-${product.id}`,
          type: 'stock',
          title: 'نفاد المخزون',
          message: `المنتج "${product.name}" غير متوفر في المخزون`,
          timestamp: new Date().toISOString(),
          read: false,
          icon: AlertCircle,
          color: 'text-red-600'
        });
      });

      // Add system notifications
      notificationsList.push({
        id: 'system-1',
        type: 'system',
        title: 'تحديث النظام',
        message: 'تم تحديث لوحة التحكم بمميزات جديدة',
        timestamp: new Date().toISOString(),
        read: false,
        icon: TrendingUp,
        color: 'text-green-600'
      });

      setNotifications(notificationsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setUnreadCount(notificationsList.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('admin-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newNotification = {
            id: `order-${payload.new.id}`,
            type: 'order',
            title: 'طلب جديد',
            message: `طلب جديد بقيمة ${payload.new.total} جنيه`,
            timestamp: payload.new.created_at,
            read: false,
            icon: ShoppingBag,
            color: 'text-blue-600'
          };

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          toast({
            title: "طلب جديد!",
            description: newNotification.message
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? prev - 1 : prev;
    });
  };

  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    return <IconComponent className={`w-5 h-5 ${notification.color}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="relative">
            <Bell className="w-8 h-8 text-primary" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">مركز الإشعارات</h2>
            <p className="text-muted-foreground">
              {unreadCount} إشعار غير مقروء من أصل {notifications.length}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="w-4 h-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الإشعارات الحديثة</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <AnimatePresence>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-start space-x-3 space-x-reverse p-4 border rounded-lg transition-colors ${
                        notification.read 
                          ? 'bg-gray-50 dark:bg-gray-800/50' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(notification.timestamp)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 space-x-reverse">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
                  <p className="text-muted-foreground">
                    ستظهر الإشعارات الجديدة هنا
                  </p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
