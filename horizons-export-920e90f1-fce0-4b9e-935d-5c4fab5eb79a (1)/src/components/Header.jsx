import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { getCartItemsCount, siteSettings } = useAdmin();
  const cartItemCount = getCartItemsCount();

  const handleFeatureNotImplemented = (feature) => {
    toast({
      title: `🚧 ${feature} قيد التطوير`,
      description: "هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المتجر', path: '/products' },
    { name: 'العروض', path: '/offers' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="font-bold text-xl">{siteSettings.site_name || 'Kledje'}</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 space-x-reverse text-sm font-medium">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="ghost" size="icon" onClick={() => handleFeatureNotImplemented('البحث')}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleFeatureNotImplemented('حساب المستخدم')}>
            <User className="h-5 w-5" />
          </Button>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;