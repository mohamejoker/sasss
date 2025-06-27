import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Package, CheckCircle, Truck, Home, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setIsLoading(true);

    if (!orderId.trim()) {
      setError('يرجى إدخال رقم الطلب.');
      setIsLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId.trim())
      .single();

    setIsLoading(false);

    if (dbError || !data) {
      setError('لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من الرقم والمحاولة مرة أخرى.');
    } else {
      const now = new Date();
      const orderDate = new Date(data.created_at);
      const hoursPassed = (now - orderDate) / (1000 * 60 * 60);

      let status = 'placed';
      if (hoursPassed > 1) status = 'processing';
      if (hoursPassed > 24) status = 'shipped';
      if (hoursPassed > 72) status = 'delivered';
      
      setOrder({ ...data, currentStatus: status });
    }
  };

  const statuses = [
    { id: 'placed', label: 'تم استلام الطلب', icon: <Package /> },
    { id: 'processing', label: 'قيد التجهيز', icon: <CheckCircle /> },
    { id: 'shipped', label: 'تم الشحن', icon: <Truck /> },
    { id: 'delivered', label: 'تم التوصيل', icon: <Home /> },
  ];

  const currentStatusIndex = order ? statuses.findIndex(s => s.id === order.currentStatus) : -1;

  return (
    <>
      <Helmet>
        <title>تتبع الطلب - Kledje</title>
        <meta name="description" content="تتبع حالة طلبك في متجر Kledje" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text">تتبع طلبك</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              أدخلي رقم طلبك لمعرفة حالته الآن
            </p>
          </motion.div>

          <Card className="max-w-2xl mx-auto glass-effect border-0">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex items-center space-x-2 space-x-reverse">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="مثال: KLD-123456789"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'جاري البحث...' : 'بحث'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2 space-x-reverse"
            >
              <XCircle className="w-5 h-5" />
              <p>{error}</p>
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-4xl mx-auto"
            >
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>تفاصيل الطلب #{order.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <p className="mb-4 font-semibold">حالة الطلب:</p>
                    <div className="relative flex justify-between items-center">
                      <div className="absolute left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 top-1/2 transform -translate-y-1/2"></div>
                      <div 
                        className="absolute left-0 h-1 bg-primary top-1/2 transform -translate-y-1/2 transition-all duration-500"
                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                      ></div>
                      {statuses.map((status, index) => (
                        <div key={status.id} className="z-10 text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors duration-500 ${
                            index <= currentStatusIndex ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-muted-foreground'
                          }`}>
                            {status.icon}
                          </div>
                          <p className="text-xs mt-2">{status.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">ملخص الطلب</h4>
                      <ul className="space-y-2 text-sm">
                        {order.items.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)} ج.م</span>
                          </li>
                        ))}
                        <li className="flex justify-between font-bold border-t pt-2 mt-2">
                          <span>الإجمالي</span>
                          <span>{order.total.toFixed(2)} ج.م</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">عنوان الشحن</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_info.firstName} {order.customer_info.lastName}<br />
                        {order.customer_info.address}<br />
                        {order.customer_info.city}, مصر<br />
                        {order.customer_info.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OrderTrackingPage;