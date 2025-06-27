
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserFavorites = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Heart className="w-5 h-5" />
            <span>المنتجات المفضلة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد منتجات مفضلة</h3>
            <p className="text-muted-foreground mb-4">
              أضف منتجاتك المفضلة لتجدها هنا بسهولة
            </p>
            <Button 
              onClick={() => navigate('/products')} 
              className="gradient-bg text-white"
            >
              تصفح المنتجات
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserFavorites;
