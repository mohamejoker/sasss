
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Lock, User, Eye, EyeOff, ArrowRight, ShoppingBag, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { validateEmail, validatePhone } from '@/utils/validators';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال الاسم الأول",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال الاسم الأخير",
        variant: "destructive"
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return false;
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "خطأ في رقم الهاتف",
        description: "يرجى إدخال رقم هاتف مصري صحيح",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "كلمة المرور ضعيفة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمتي المرور",
        variant: "destructive"
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: "الموافقة على الشروط",
        description: "يرجى الموافقة على الشروط والأحكام",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password);
      if (!error) {
        toast({
          title: "مرحباً بك في Kledje! 🎉",
          description: "تم إنشاء حسابك بنجاح. يرجى التحقق من بريدك الإلكتروني"
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>إنشاء حساب جديد - Kledje</title>
        <meta name="description" content="انضم إلى عائلة Kledje وابدأ رحلتك في عالم منتجات العناية الطبيعية" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-fuchsia-900/20 dark:to-purple-900/20">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold gradient-text">
                    انضم إلى عائلة Kledje
                  </CardTitle>
                  <p className="text-muted-foreground">
                    أنشئ حسابك واستمتع بتجربة تسوق فريدة
                  </p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">الاسم الأول</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="أحمد"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">الاسم الأخير</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="محمد"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2 space-x-reverse">
                        <Mail className="w-4 h-4" />
                        <span>البريد الإلكتروني</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2 space-x-reverse">
                        <Phone className="w-4 h-4" />
                        <span>رقم الهاتف</span>
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="01012345678"
                        dir="ltr"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center space-x-2 space-x-reverse">
                        <Lock className="w-4 h-4" />
                        <span>كلمة المرور</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="••••••••"
                          className="pl-12"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="••••••••"
                          className="pl-12"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={setAcceptTerms}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        أوافق على{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          الشروط والأحكام
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 gradient-bg text-white font-bold text-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>جاري إنشاء الحساب...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span>إنشاء حساب</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      لديك حساب بالفعل؟{' '}
                      <Link to="/login" className="text-primary hover:underline font-medium">
                        تسجيل الدخول
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-6 text-center"
              >
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ← العودة إلى المتجر
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;
