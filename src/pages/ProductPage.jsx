import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const ProductPage = () => {
  const { id } = useParams();
  const { products, addToCart } = useAdmin();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Link to="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = () => {
    toast({
      title: "🔗 المشاركة قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const handleWishlist = () => {
    toast({
      title: "❤️ قائمة الأمنيات قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  const productImages = product.image ? [product.image, product.image, product.image] : [];

  return (
    <>
      <Helmet>
        <title>{product.name || 'منتج'} - Kledje</title>
        <meta name="description" content={product.description || ''} />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 space-x-reverse mb-8 text-sm"
          >
            <Link to="/" className="text-muted-foreground hover:text-primary">
              الرئيسية
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/products" className="text-muted-foreground hover:text-primary">
              المتجر
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{product.name}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline">{product.category}</Badge>
                {product.in_stock ? (
                  <Badge className="bg-green-500 text-white">
                    <Check className="w-3 h-3 ml-1" />
                    متوفر
                  </Badge>
                ) : (
                  <Badge variant="destructive">غير متوفر</Badge>
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                {product.name_en && (
                  <p className="text-lg text-muted-foreground">{product.name_en}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex items-center space-x-1 space-x-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground">(4.9) • 127 تقييم</span>
              </div>

              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-4xl font-bold text-primary">{product.price} ج.م</span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.original_price} ج.م
                  </span>
                )}
                {product.discount && (
                  <Badge className="bg-red-500 text-white">
                    وفر {product.discount}%
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">المكونات</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="font-medium">الكمية:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="w-full gradient-bg text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  {product.in_stock ? 'أضيفي إلى السلة' : 'غير متوفر'}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleWishlist}
                    className="flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <Heart className="w-4 h-4" />
                    <span>أضيفي للمفضلة</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductPage;