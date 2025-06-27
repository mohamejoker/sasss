
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Lock, User, Eye, EyeOff, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        toast({
          title: "مرحباً بك! 🎉",
          description: "تم تسجيل الدخول بنجاح"
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - Kledje</title>
        <meta name="description" content="سجل دخولك إلى حسابك في متجر Kledje للاستمتاع بتجربة تسوق مميزة" />
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
                    مرحباً بعودتك!
                  </CardTitle>
                  <p className="text-muted-foreground">
                    سجل دخولك للاستمتاع بتجربة تسوق مميزة
                  </p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2 space-x-reverse">
                        <User className="w-4 h-4" />
                        <span>البريد الإلكتروني</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="h-12"
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-12 pl-12"
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

                    <Button
                      type="submit"
                      className="w-full h-12 gradient-bg text-white font-bold text-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>جاري تسجيل الدخول...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span>تسجيل الدخول</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      ليس لديك حساب؟{' '}
                      <Link to="/register" className="text-primary hover:underline font-medium">
                        إنشاء حساب جديد
                      </Link>
                    </p>
                    
                    <div className="text-sm">
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => toast({
                          title: "🔄 استعادة كلمة المرور قيد التطوير",
                          description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
                        })}
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
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

export default LoginPage;
