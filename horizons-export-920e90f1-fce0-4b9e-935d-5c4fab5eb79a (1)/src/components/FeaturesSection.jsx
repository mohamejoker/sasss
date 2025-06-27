import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Leaf, Truck, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Leaf className="w-10 h-10 text-green-500" />,
    title: 'مكونات طبيعية 100%',
    description: 'نستخدم فقط أجود المكونات الطبيعية لضمان أفضل النتائج لبشرتك وشعرك.'
  },
  {
    icon: <Droplet className="w-10 h-10 text-blue-500" />,
    title: 'ترطيب عميق وفعال',
    description: 'منتجاتنا مصممة لتوفر ترطيباً يدوم طويلاً ويترك بشرتك ناعمة كالحرير.'
  },
  {
    icon: <Truck className="w-10 h-10 text-orange-500" />,
    title: 'توصيل سريع لكل مصر',
    description: 'طلباتك تصلك في أسرع وقت ممكن أينما كنتِ في جميع أنحاء مصر.'
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-pink-500" />,
    title: 'آمن ومختبر',
    description: 'جميع منتجاتنا خالية من الكيماويات الضارة ومختبرة لضمان أمانها الكامل.'
  }
];

const FeaturesSection = () => {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-16 bg-secondary dark:bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            لماذا تختارين Kledje؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نحن نؤمن بأن الجمال الحقيقي ينبع من الطبيعة، ولهذا نقدم لكِ الأفضل.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center h-full product-card-hover glass-effect border-0">
                <CardHeader>
                  <div className="mx-auto bg-white/50 dark:bg-black/20 rounded-full p-4 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;