
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/utils/formatters';

const UserStats = ({ userStats }) => {
  const statsConfig = [
    {
      title: 'إجمالي الطلبات',
      value: userStats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      delay: 0.1
    },
    {
      title: 'إجمالي الإنفاق',
      value: formatPrice(userStats.totalSpent),
      icon: () => (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
          ج.م
        </div>
      ),
      color: 'text-green-600',
      delay: 0.2
    },
    {
      title: 'طلبات مكتملة',
      value: userStats.completedOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      delay: 0.3
    },
    {
      title: 'طلبات قيد التنفيذ',
      value: userStats.pendingOrders,
      icon: Clock,
      color: 'text-orange-600',
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
        >
          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default UserStats;
