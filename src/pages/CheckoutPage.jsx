import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, User, CreditCard, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useAdmin();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: ''
  });

  const egyptianCities = [
    'القاهرة', 'الجيزة', 'الأسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية',
    'البحيرة', 'الغربية', 'بور سعيد', 'دمياط', 'الإسماعيلية', 'السويس', 'كفر الشيخ',
    'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان'
  ];

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'phone', 'city', 'address'];
    for (let field of required) {
      if (!orderData[field].trim()) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return false;
      }
    }

    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    if (!phoneRegex.test(orderData.phone.replace(/\s/g, ''))) {
      toast({
        title: "رقم هاتف غير صحيح",
        description: "يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    if (cart.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "لا يمكن إتمام طلب فارغ",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    const orderId = `KLD-${Date.now()}`;
    const orderPayload = {
      id: orderId,
      items: cart,
      total: getCartTotal(),
      customer_info: orderData,
      status: 'placed',
      payment_method: 'cod',
    };

    const { error } = await supabase.from('orders').insert([orderPayload]);

    setIsProcessing(false);

    if (error) {
      toast({ title: "خطأ في الطلب", description: error.message, variant: "destructive" });
    } else {
      clearCart();
      toast({
        title: "تم إرسال طلبك بنجاح! 🎉",
        description: `رقم الطلب: ${orderId}`,
      });
      navigate('/', { 
        state: { 
          orderSuccess: true, 
          orderId: orderId 
        } 
      });
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>إتمام الطلب - Kledje</title>
        <meta name="description" content="إتمام طلب الشراء" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">إتمام الطلب</h1>
              <p className="text-muted-foreground mt-1">
                أكملي بياناتك لإتمام عملية الشراء
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للسلة</span>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <User className="w-5 h-5" />
                      <span>المعلومات الشخصية</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">الاسم الأول *</Label>
                        <Input
                          id="firstName"
                          value={orderData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="فاطمة"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">اسم العائلة *</Label>
                        <Input
                          id="lastName"
                          value={orderData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="علي"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          value={orderData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="01xxxxxxxxx"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={orderData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="example@email.com"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-5 h-5" />
                      <span>عنوان التوصيل</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="city">المحافظة *</Label>
                      <Select value={orderData.city} onValueChange={(value) => handleInputChange('city', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختاري المحافظة" />
                        </SelectTrigger>
                        <SelectContent>
                          {egyptianCities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">العنوان التفصيلي *</Label>
                      <Textarea
                        id="address"
                        value={orderData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="المنطقة، الشارع، رقم المبنى، رقم الشقة..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                      <Textarea
                        id="notes"
                        value={orderData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="أي ملاحظات خاصة للتوصيل..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <CreditCard className="w-5 h-5" />
                      <span>طريقة الدفع</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">الدفع عند الاستلام (COD)</h3>
                          <p className="text-sm text-muted-foreground">
                            ادفعي نقداً عند استلام طلبك
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="glass-effect border-0 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Package className="w-5 h-5" />
                    <span>ملخص الطلب</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × {item.price} ج.م
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {(item.price * item.quantity).toFixed(2)} ج.م
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

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

                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="w-full gradient-bg text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري المعالجة...</span>
                      </div>
                    ) : (
                      'تأكيد الطلب'
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground space-y-1">
                    <p>🔒 معاملة آمنة ومحمية</p>
                    <p>📞 سيتم التواصل معكِ لتأكيد الطلب</p>
                    <p>🚚 التوصيل خلال 2-5 أيام عمل</p>
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

export default CheckoutPage;