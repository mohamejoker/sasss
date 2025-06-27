import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Gift, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const OffersSection = () => {
  const { offers } = useAdmin();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const newTimeLeft = {};

      offers.forEach(offer => {
        if (offer.active && offer.endDate) {
          const endTime = new Date(offer.endDate).getTime();
          const difference = endTime - now;

          if (difference > 0) {
            newTimeLeft[offer.id] = {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
          }
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [offers]);

  const activeOffers = offers.filter(offer => offer.active);

  if (activeOffers.length === 0) return null;

  const handleOfferClick = () => {
    toast({
      title: "🎁 العروض قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                           radial-gradient(circle at 80% 50%, white 2px, transparent 2px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 text-white"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Gift className="w-16 h-16 mx-auto drop-shadow-lg" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            عروض حصرية لفترة محدودة
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            لا تفوتي الفرصة! خصومات مذهلة على منتجاتنا المميزة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="glass-effect border-0 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Badge className="bg-yellow-400 text-black font-bold mb-3">
                        <Zap className="w-4 h-4 ml-1" />
                        عرض خاص
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                      <p className="opacity-90">{offer.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-yellow-300">
                        {offer.discount}%
                      </div>
                      <div className="text-sm opacity-80">خصم</div>
                    </div>
                  </div>

                  {timeLeft[offer.id] && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 space-x-reverse mb-3">
                        <Clock className="w-5 h-5 text-yellow-300" />
                        <span className="font-medium">ينتهي العرض خلال:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'يوم', value: timeLeft[offer.id].days },
                          { label: 'ساعة', value: timeLeft[offer.id].hours },
                          { label: 'دقيقة', value: timeLeft[offer.id].minutes },
                          { label: 'ثانية', value: timeLeft[offer.id].seconds }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            className="text-center bg-white/20 rounded-lg p-3"
                          >
                            <div className="text-2xl font-bold">{item.value}</div>
                            <div className="text-xs opacity-80">{item.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-1 space-x-reverse mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                    ))}
                    <span className="mr-2 opacity-90">(4.9)</span>
                  </div>

                  <Button
                    onClick={handleOfferClick}
                    className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    احصلي على العرض الآن
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-6 h-6 bg-pink-300 rounded-full opacity-60"
        />
        <motion.div
          animate={{ x: [-30, 30, -30] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-20 w-4 h-4 bg-white rounded-full opacity-40"
        />
      </div>
    </section>
  );
};

export default OffersSection;