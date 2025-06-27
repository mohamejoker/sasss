import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { siteSettings } = useAdmin();

  const handleSocialClick = (platform) => {
    toast({
      title: `📱 ${platform} قيد التطوير`,
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "📧 النشرة الإخبارية قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المتجر', path: '/products' },
    { name: 'العروض', path: '/offers' },
    { name: 'تتبع الطلب', path: '/track-order' },
    { name: 'اتصل بنا', path: '/contact' },
    { name: 'سياسة الخصوصية', path: '/privacy' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-fuchsia-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <span className="text-2xl font-bold">{siteSettings.site_name}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              متجرك المتخصص في منتجات العناية الطبيعية عالية الجودة. نقدم لك أفضل المنتجات الطبيعية للعناية بجمالك.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('فيسبوك')}
                className="rounded-full hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('إنستغرام')}
                className="rounded-full hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick('تويتر')}
                className="rounded-full hover:bg-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <span className="text-xl font-bold">روابط سريعة</span>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-gray-300 hover:text-white transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <span className="text-xl font-bold">تواصل معنا</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{siteSettings.contact_info?.phone}</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{siteSettings.contact_info?.email}</span>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-red-400 mt-1" />
                <span className="text-gray-300">{siteSettings.contact_info?.address}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <span className="text-xl font-bold">النشرة الإخبارية</span>
            <p className="text-gray-300">
              اشتركي في نشرتنا الإخبارية للحصول على آخر العروض والمنتجات الجديدة
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button
                type="submit"
                className="w-full gradient-bg hover:opacity-90 font-bold"
              >
                اشتركي الآن
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/20 mt-12 pt-8 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-300">
              © 2024 {siteSettings.site_name}. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center space-x-2 space-x-reverse text-gray-300">
              <span>صُنع بـ</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              </motion.div>
              <span>في مصر</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;