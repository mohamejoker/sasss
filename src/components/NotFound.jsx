import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-fuchsia-900/20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        <Card className="glass-effect border-0">
          <CardContent className="p-8 space-y-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl font-bold gradient-text"
            >
              404
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
              <p className="text-muted-foreground">
                عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <Button className="w-full gradient-bg text-white">
                  <Home className="w-4 h-4 ml-2" />
                  العودة للرئيسية
                </Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 ml-2" />
                  تصفح المنتجات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;