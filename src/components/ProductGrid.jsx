import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const ProductGrid = () => {
  const { products, addToCart } = useAdmin();
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    toast({
      title: "❤️ المفضلة قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const handleQuickView = (product) => {
    toast({
      title: "👁️ المعاينة السريعة قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const featuredProducts = products.filter(product => product.featured);

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-fuchsia-900/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            الأكثر مبيعاً
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشفي مجموعتنا المختارة من المنتجات التي تعشقها عميلاتنا
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="product-card-hover glass-effect border-0 overflow-hidden group">
                <div className="relative">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </Link>

                  {product.discount && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                      <Tag className="w-3 h-3 ml-1" />
                      -{product.discount}%
                    </Badge>
                  )}

                  <div className="absolute top-3 left-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toggleFavorite(product.id)}
                      className="rounded-full w-8 h-8"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(product.id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleQuickView(product)}
                      className="rounded-full w-8 h-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="absolute inset-x-0 bottom-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-white text-black hover:bg-gray-100 font-bold rounded-full px-6 py-2 transform scale-90 group-hover:scale-100 transition-transform duration-300"
                    >
                      <ShoppingCart className="w-4 h-4 ml-2" />
                      أضيفي للسلة
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {product.category}
                  </Badge>

                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>

                  <div className="flex items-center space-x-1 space-x-reverse mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground mr-2">
                      (4.9)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-2xl font-bold text-primary">
                        {product.price} ج.م
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.original_price} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <Button
              size="lg"
              className="gradient-bg text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              عرض جميع المنتجات
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;