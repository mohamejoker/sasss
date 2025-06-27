import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { formatPrice, formatDate } from '@/utils/formatters';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
        title: "خطأ في تحميل الطلبات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "تم تحديث حالة الطلب",
        description: `تم تغيير حالة الطلب إلى ${getStatusLabel(newStatus)}`
      });
    } catch (error) {
      toast({
        title: "خطأ في تحديث الطلب",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'placed': 'تم الاستلام',
      'processing': 'قيد التجهيز',
      'shipped': 'تم الشحن',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return statusLabels[status] || status;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'placed': 'secondary',
      'processing': 'default',
      'shipped': 'outline',
      'delivered': 'default',
      'cancelled': 'destructive'
    };
    
    const colors = {
      'placed': 'bg-blue-500 text-white',
      'processing': 'bg-yellow-500 text-white',
      'shipped': 'bg-purple-500 text-white',
      'delivered': 'bg-green-500 text-white',
      'cancelled': 'bg-red-500 text-white'
    };

    return (
      <Badge className={colors[status]}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_info.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_info.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_info.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    placed: orders.filter(o => o.status === 'placed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
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
          <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
          <p className="text-muted-foreground">متابعة وإدارة جميع طلبات العملاء</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{orderStats.total}</p>
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{orderStats.placed}</p>
              <p className="text-sm text-muted-foreground">جديدة</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{orderStats.processing}</p>
              <p className="text-sm text-muted-foreground">قيد التجهيز</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
              <p className="text-sm text-muted-foreground">تم الشحن</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              <p className="text-sm text-muted-foreground">تم التوصيل</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
              <p className="text-sm text-muted-foreground">ملغية</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث برقم الطلب أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="placed">تم الاستلام</SelectItem>
            <SelectItem value="processing">قيد التجهيز</SelectItem>
            <SelectItem value="shipped">تم الشحن</SelectItem>
            <SelectItem value="delivered">تم التوصيل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 space-x-reverse mb-2">
                        <h3 className="font-bold">#{order.id.slice(0, 8)}</h3>
                        {getStatusBadge(order.status)}
                        <Badge variant="outline">
                          {order.payment_method === 'cod' ? 'دفع عند الاستلام' : 'دفع إلكتروني'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">العميل:</p>
                          <p className="text-muted-foreground">
                            {order.customer_info.firstName} {order.customer_info.lastName}
                          </p>
                          <p className="text-muted-foreground">{order.customer_info.email}</p>
                          <p className="text-muted-foreground">{order.customer_info.phone}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium">العنوان:</p>
                          <p className="text-muted-foreground">
                            {order.customer_info.address}, {order.customer_info.city}
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium">تاريخ الطلب:</p>
                          <p className="text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                          <p className="font-bold text-lg text-primary">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الطلب #{order.id.slice(0, 8)}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">معلومات العميل</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">الاسم:</span> {selectedOrder.customer_info.firstName} {selectedOrder.customer_info.lastName}</p>
                                    <p><span className="font-medium">البريد:</span> {selectedOrder.customer_info.email}</p>
                                    <p><span className="font-medium">الهاتف:</span> {selectedOrder.customer_info.phone}</p>
                                    <p><span className="font-medium">العنوان:</span> {selectedOrder.customer_info.address}</p>
                                    <p><span className="font-medium">المدينة:</span> {selectedOrder.customer_info.city}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">معلومات الطلب</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">رقم الطلب:</span> {selectedOrder.id}</p>
                                    <p><span className="font-medium">التاريخ:</span> {formatDate(selectedOrder.created_at)}</p>
                                    <p><span className="font-medium">الحالة:</span> {getStatusLabel(selectedOrder.status)}</p>
                                    <p><span className="font-medium">طريقة الدفع:</span> {selectedOrder.payment_method === 'cod' ? 'دفع عند الاستلام' : 'دفع إلكتروني'}</p>
                                    <p><span className="font-medium">الإجمالي:</span> <span className="font-bold text-primary">{formatPrice(selectedOrder.total)}</span></p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">المنتجات المطلوبة</h4>
                                <div className="space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                      <div className="flex items-center space-x-3 space-x-reverse">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                        <div>
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                                        </div>
                                      </div>
                                      <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">تحديث حالة الطلب</h4>
                                <Select
                                  value={selectedOrder.status}
                                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="placed">تم الاستلام</SelectItem>
                                    <SelectItem value="processing">قيد التجهيز</SelectItem>
                                    <SelectItem value="shipped">تم الشحن</SelectItem>
                                    <SelectItem value="delivered">تم التوصيل</SelectItem>
                                    <SelectItem value="cancelled">ملغي</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="placed">تم الاستلام</SelectItem>
                          <SelectItem value="processing">قيد التجهيز</SelectItem>
                          <SelectItem value="shipped">تم الشحن</SelectItem>
                          <SelectItem value="delivered">تم التوصيل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'لا توجد طلبات تطابق معايير البحث'
                      : 'لم يتم استلام أي طلبات بعد'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrdersManagement;