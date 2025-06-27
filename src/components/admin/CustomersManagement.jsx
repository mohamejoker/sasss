import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { formatPrice, formatDate } from '@/utils/formatters';

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(ordersData || []);

      // Extract unique customers from orders
      const customersMap = new Map();
      ordersData?.forEach(order => {
        const customerInfo = order.customer_info;
        const customerId = customerInfo.email;
        
        if (!customersMap.has(customerId)) {
          customersMap.set(customerId, {
            id: customerId,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            city: customerInfo.city,
            address: customerInfo.address,
            firstOrderDate: order.created_at,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.created_at
          });
        }

        const customer = customersMap.get(customerId);
        customer.totalOrders += 1;
        customer.totalSpent += order.total;
        
        // Update last order date if this order is more recent
        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.created_at;
        }
        
        // Update first order date if this order is older
        if (new Date(order.created_at) < new Date(customer.firstOrderDate)) {
          customer.firstOrderDate = order.created_at;
        }
      });

      setCustomers(Array.from(customersMap.values()));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getCustomerOrders = (customerEmail) => {
    return orders.filter(order => order.customer_info.email === customerEmail);
  };

  const getCustomerType = (totalSpent) => {
    if (totalSpent >= 1000) return { label: 'عميل ذهبي', color: 'bg-yellow-500' };
    if (totalSpent >= 500) return { label: 'عميل فضي', color: 'bg-gray-400' };
    return { label: 'عميل جديد', color: 'bg-blue-500' };
  };

  const customerStats = {
    total: customers.length,
    newThisMonth: customers.filter(c => {
      const orderDate = new Date(c.firstOrderDate);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }).length,
    returning: customers.filter(c => c.totalOrders > 1).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
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
          <h1 className="text-3xl font-bold">إدارة العملاء</h1>
          <p className="text-muted-foreground">متابعة وإدارة قاعدة عملاء المتجر</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
                <p className="text-2xl font-bold">{customerStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">عملاء جدد هذا الشهر</p>
                <p className="text-2xl font-bold text-green-600">{customerStats.newThisMonth}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">عملاء متكررون</p>
                <p className="text-2xl font-bold text-purple-600">{customerStats.returning}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(customerStats.totalRevenue)}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                ج.م
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </motion.div>

      {/* Customers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCustomers.map((customer, index) => {
          const customerType = getCustomerType(customer.totalSpent);
          
          return (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{customer.firstName} {customer.lastName}</h3>
                        <Badge className={`${customerType.color} text-white text-xs`}>
                          {customerType.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{customer.city}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{customer.totalOrders}</p>
                      <p className="text-xs text-muted-foreground">طلب</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{formatPrice(customer.totalSpent)}</p>
                      <p className="text-xs text-muted-foreground">إجمالي الإنفاق</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    آخر طلب: {formatDate(customer.lastOrderDate)}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        عرض التفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>تفاصيل العميل</DialogTitle>
                      </DialogHeader>
                      {selectedCustomer && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">المعلومات الشخصية</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">الاسم:</span> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                                <p><span className="font-medium">البريد:</span> {selectedCustomer.email}</p>
                                <p><span className="font-medium">الهاتف:</span> {selectedCustomer.phone}</p>
                                <p><span className="font-medium">المدينة:</span> {selectedCustomer.city}</p>
                                <p><span className="font-medium">العنوان:</span> {selectedCustomer.address}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">إحصائيات الطلبات</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">إجمالي الطلبات:</span> {selectedCustomer.totalOrders}</p>
                                <p><span className="font-medium">إجمالي الإنفاق:</span> <span className="font-bold text-green-600">{formatPrice(selectedCustomer.totalSpent)}</span></p>
                                <p><span className="font-medium">متوسط قيمة الطلب:</span> {formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}</p>
                                <p><span className="font-medium">أول طلب:</span> {formatDate(selectedCustomer.firstOrderDate)}</p>
                                <p><span className="font-medium">آخر طلب:</span> {formatDate(selectedCustomer.lastOrderDate)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">تاريخ الطلبات</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {getCustomerOrders(selectedCustomer.email).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-2 border rounded">
                                  <div>
                                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
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
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredCustomers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد عملاء</h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'لا توجد عملاء تطابق معايير البحث'
              : 'لم يتم استلام أي طلبات من العملاء بعد'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CustomersManagement;