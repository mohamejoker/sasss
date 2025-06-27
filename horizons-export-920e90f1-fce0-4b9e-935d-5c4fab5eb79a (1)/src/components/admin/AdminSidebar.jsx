import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Users, 
  Warehouse, 
  BarChart3, 
  Settings,
  ChevronLeft,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'نظرة عامة', path: '/admin/dashboard' },
    { icon: Package, label: 'إدارة المنتجات', path: '/admin/dashboard/products' },
    { icon: ShoppingCart, label: 'إدارة الطلبات', path: '/admin/dashboard/orders' },
    { icon: Tag, label: 'إدارة العروض', path: '/admin/dashboard/offers' },
    { icon: Users, label: 'إدارة العملاء', path: '/admin/dashboard/customers' },
    { icon: Warehouse, label: 'إدارة المخزون', path: '/admin/dashboard/inventory' },
    { icon: BarChart3, label: 'التقارير والتحليلات', path: '/admin/dashboard/reports' },
    { icon: Settings, label: 'إعدادات الموقع', path: '/admin/dashboard/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : '-100%',
          width: isOpen ? 256 : 64
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "fixed top-0 right-0 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 lg:z-30",
          "shadow-xl lg:shadow-none",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3 space-x-reverse"
          >
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
              K
            </div>
            {isOpen && (
              <div>
                <h2 className="font-bold text-lg">Kledje</h2>
                <p className="text-xs text-muted-foreground">لوحة التحكم</p>
              </div>
            )}
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", !isOpen && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <motion.span
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("font-medium", !isOpen && "sr-only")}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Store className="w-5 h-5 flex-shrink-0" />
              <motion.span
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn("font-medium", !isOpen && "sr-only")}
              >
                عرض المتجر
              </motion.span>
            </motion.div>
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;