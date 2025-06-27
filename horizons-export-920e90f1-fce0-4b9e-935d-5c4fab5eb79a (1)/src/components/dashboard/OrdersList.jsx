
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/utils/formatters';
import LoadingSpinner from '@/components/LoadingSpinner';

const OrdersList = ({ orders, loading }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      'placed': { label: 'تم الاستلام', color: 'bg-blue-500' },
      'processing': { label: 'قيد التجهيز', color: 'bg-yellow-500' },
      'shipped': { label: 'تم الشحن', color: 'bg-purple-500' },
      'delivered': { label: 'تم التوصيل', color: 'bg-green-500' },
      'cancelled': { label: 'ملغي', color: 'bg-red-500' }
    };

    const config = statusConfig[status] || statusConfig['placed'];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle>طلباتي ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-bold">#{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">المنتجات:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse text-sm">
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                          <span>{item.name} × {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد طلبات بعد</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ التسوق واستمتع بمنتجاتنا الرائعة
              </p>
              <Button onClick={() => navigate('/products')} className="gradient-bg text-white">
                تصفح المنتجات
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrdersList;
