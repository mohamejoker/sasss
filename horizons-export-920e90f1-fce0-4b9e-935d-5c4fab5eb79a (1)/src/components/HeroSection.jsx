import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Sparkles, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';

const HeroSection = () => {
  const { siteSettings, products } = useAdmin();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: siteSettings.hero_title,
      subtitle: siteSettings.hero_subtitle,
      image: products[0]?.image || "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
      cta: 'اكتشفي سر جمالك',
      link: '/products'
    },
    {
      title: 'عروض خاصة لفترة محدودة',
      subtitle: 'خصومات تصل إلى 30% على منتجات مختارة',
      image: products[1]?.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      cta: 'تسوقي العروض',
      link: '/offers'
    },
    {
      title: 'مكونات طبيعية 100%',
      subtitle: 'آمنة وفعالة لجميع أنواع البشرة',
      image: products[2]?.image || "https://images.unsplash.com/photo-1563806289-533554284534",
      cta: 'اعرفي المزيد',
      link: '/#features'
    }
  ];

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  if (heroSlides.length === 0) {
    return <div className="h-screen flex items-center justify-center">تحميل...</div>;
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-10"></div>
      
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center"
            style={{
              background: `linear-gradient(135deg, rgba(247, 143, 179, 0.85) 0%, rgba(229, 178, 202, 0.85) 100%), url(${slide.image}) center/cover`
            }}
          >
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <span className="text-yellow-300 font-medium">منتجات مميزة</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                  className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                  className="text-xl md:text-2xl opacity-90 leading-relaxed drop-shadow-sm"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                  className="flex items-center space-x-4 space-x-reverse"
                >
                  <Link to={slide.link}>
                    <Button
                      size="lg"
                      className="bg-white text-pink-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {slide.cta}
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                    ))}
                    <span className="text-white mr-2">4.9/5</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentSlide === index ? 1 : 0, scale: currentSlide === index ? 1 : 0.8 }}
                transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
                className="relative hidden md:block"
              >
                <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className="w-80 h-80 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <motion.img
                      src={slide.image}
                      alt="منتج مميز"
                      className="w-64 h-64 object-cover rounded-full shadow-2xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-pink-600" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-4 -left-4 w-10 h-10 text-white/50"
                  >
                    <Droplet className="w-full h-full" fill="currentColor" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;