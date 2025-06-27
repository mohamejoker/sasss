import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/lib/supabaseClient';

const categories = [
  'العناية بالبشرة',
  'العناية بالشعر',
  'العناية الشخصية',
  'العطور',
  'مجموعات خاصة'
];

const AnalyticsTab = () => {
  const { products, offers } = useAdmin();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed': return <Badge variant="secondary">تم الاستلام</Badge>;
      case 'processing': return <Badge className="bg-blue-500 text-white">قيد التجهيز</Badge>;
      case 'shipped': return <Badge className="bg-yellow-500 text-white">تم الشحن</Badge>;
      case 'delivered': return <Badge className="bg-green-500 text-white">تم التوصيل</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardContent className="p-6"><div className="text-center"><div className="text-3xl font-bold text-primary">{products.length}</div><div className="text-muted-foreground">إجمالي المنتجات</div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-center"><div className="text-3xl font-bold text-green-600">{products.filter(p => p.inStock).length}</div><div className="text-muted-foreground">منتجات متوفرة</div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-center"><div className="text-3xl font-bold text-blue-600">{orders.length}</div><div className="text-muted-foreground">إجمالي الطلبات</div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-center"><div className="text-3xl font-bold text-orange-600">{offers.filter(o => o.active).length}</div><div className="text-muted-foreground">عروض نشطة</div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>أحدث الطلبات</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_info.firstName} {order.customer_info.lastName}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{order.total.toFixed(2)} ج.م</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-muted-foreground text-center">لا توجد طلبات بعد.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>إحصائيات المنتجات حسب الفئة</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category);
                const percentage = products.length > 0 ? (categoryProducts.length / products.length) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm">{category}</span><span className="text-sm">{categoryProducts.length} منتج</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;