import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const categories = [
  { name: 'العناية بالبشرة', imageText: 'elegant skincare products on display', link: '/products' },
  { name: 'العناية بالشعر', imageText: 'natural hair care products with argan oil', link: '/products' },
  { name: 'العناية الشخصية', imageText: 'luxury personal care items like deodorant and creams', link: '/products' },
  { name: 'العطور', imageText: 'beautiful perfume bottle with floral scents', link: '/products' },
  { name: 'مجموعات خاصة', imageText: 'curated gift box with various beauty products', link: '/products' },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            تسوقي حسب الفئة
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشفي منتجاتنا المصنفة بعناية لتلبية كل احتياجاتك.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link to={category.link}>
                <Card className="relative overflow-hidden rounded-2xl border-0 h-64 md:h-80 shadow-lg">
                  <img  alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white flex items-end justify-between">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-1">
                      <ArrowLeft className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;