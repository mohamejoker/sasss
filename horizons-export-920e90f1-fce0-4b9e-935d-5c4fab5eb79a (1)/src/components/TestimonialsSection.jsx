import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'نورهان',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    city: 'القاهرة',
    rating: 5,
    quote: 'المنتجات أكتر من رائعة! بشرتي عمرها ما كانت بالجمال والنضارة دي. شكرًا Kledje!'
  },
  {
    name: 'سارة',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    city: 'الأسكندرية',
    rating: 5,
    quote: 'كريم الشعر بزيت الأرجان سحر! شعري بقى ناعم وبيلمع من أول استخدام. بنصح بيه جدًا.'
  },
  {
    name: 'مريم',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    city: 'الجيزة',
    rating: 5,
    quote: 'بوكس الدلع كان أحلى هدية لنفسي. كل منتج فيه أحلى من التاني والتغليف يفتح النفس.'
  }
];

const TestimonialsSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
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
            عميلاتنا بيقولوا إيه؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            آراء حقيقية من عميلاتنا السعيدات اللي وثقوا في منتجاتنا.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full product-card-hover glass-effect border-0 flex flex-col">
                <CardContent className="p-6 flex-grow flex flex-col">
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <p className="text-muted-foreground flex-grow mb-6">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mr-4">
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse mr-auto">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;