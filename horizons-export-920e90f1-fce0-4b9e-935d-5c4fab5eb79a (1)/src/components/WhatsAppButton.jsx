import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

const WhatsAppButton = () => {
  const { siteSettings } = useAdmin();
  
  const handleWhatsAppClick = () => {
    const phone = siteSettings.contact_info?.phone?.replace(/\s/g, '').replace('+', '');
    const message = encodeURIComponent(`مرحباً! أريد الاستفسار عن منتجات ${siteSettings.site_name || 'Kledje'}`);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <motion.button
        onClick={handleWhatsAppClick}
        className="relative w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MessageCircle className="w-8 h-8" />
        
        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          تواصل معنا عبر واتساب
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default WhatsAppButton;