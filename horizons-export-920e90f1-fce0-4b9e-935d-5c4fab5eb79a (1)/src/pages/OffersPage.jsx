import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tag, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OffersPage = () => {
  const { offers } = useAdmin();
  const activeOffers = offers.filter(offer => offer.active && new Date(offer.end_date) > new Date());

  const getTimeLeft = (endDate) => {
    const total = Date.parse(endDate) - Date.parse(new Date());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return { days, hours };
  };

  return (
    <>
      <Helmet>
        <title>العروض الخاصة - Kledje</title>
        <meta name="description" content="اكتشفي آخر العروض والخصومات من Kledje." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text">العروض الخاصة</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              لا تفوتي فرصة الحصول على منتجاتك المفضلة بأفضل الأسعار
            </p>
          </motion.div>

          {activeOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeOffers.map((offer, index) => {
                const timeLeft = getTimeLeft(offer.end_date);
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full product-card-hover glass-effect border-0 overflow-hidden group">
                      <CardHeader className="bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white p-6">
                        <CardTitle className="flex items-center space-x-2 space-x-reverse">
                          <Tag className="w-6 h-6" />
                          <span>{offer.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <p className="text-muted-foreground">{offer.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="text-2xl font-bold py-2 px-4 bg-red-500 text-white">
                            خصم {offer.discount}%
                          </Badge>
                          {offer.category && <Badge variant="secondary">{offer.category}</Badge>}
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground pt-4 border-t">
                          <Clock className="w-4 h-4" />
                          <span>
                            ينتهي خلال: {timeLeft.days} يوم و {timeLeft.hours} ساعة
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">لا توجد عروض متاحة حالياً. ترقبي جديدنا!</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default OffersPage;