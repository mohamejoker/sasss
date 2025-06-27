import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useAdmin();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <>
        <Helmet>
          <title>سلة التسوق - Kledje</title>
          <meta name="description" content="سلة التسوق فارغة" />
        </Helmet>

        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold">سلة التسوق فارغة</h1>
              <p className="text-muted-foreground text-lg">
                لم تقومي بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
              <Link to="/">
                <Button size="lg" className="gradient-bg text-white font-bold px-8 py-3 rounded-full">
                  تصفحي المنتجات
                </Button>
              </Link>
            </motion.div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>سلة التسوق ({cart.length}) - Kledje</title>
        <meta name="description" content="مراجعة منتجات سلة التسوق" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">سلة التسوق</h1>
              <p className="text-muted-foreground mt-1">
                لديكِ {cart.length} منتج في السلة
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                <ArrowLeft className="w-4 h-4" />
                <span>متابعة التسوق</span>
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {item.category}
                          </p>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="text-lg font-bold text-primary">
                              {item.price} ج.م
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {item.originalPrice} ج.م
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {(item.price * item.quantity).toFixed(2)} ج.م
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  إفراغ السلة
                </Button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="glass-effect border-0 sticky top-8">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-bold">ملخص الطلب</h2>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي</span>
                      <span>{getCartTotal().toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الشحن</span>
                      <span className="text-green-600">مجاني</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>الضريبة</span>
                      <span>محتسبة في السعر</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>المجموع الكلي</span>
                      <span className="text-primary">{getCartTotal().toFixed(2)} ج.م</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">طريقة الدفع</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      الدفع عند الاستلام (COD)
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full gradient-bg text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    إتمام الطلب
                  </Button>

                  {/* Security Note */}
                  <div className="text-center text-xs text-muted-foreground">
                    <p>🔒 معاملة آمنة ومحمية</p>
                    <p>✅ ضمان استرداد الأموال</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;