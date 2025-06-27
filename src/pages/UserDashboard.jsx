import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserStats from '@/components/dashboard/UserStats';
import OrdersList from '@/components/dashboard/OrdersList';
import UserProfile from '@/components/dashboard/UserProfile';
import UserFavorites from '@/components/dashboard/UserFavorites';
import UserFavoritesManager from '@/components/user/UserFavoritesManager';
import UserProfileEditor from '@/components/user/UserProfileEditor';
import AddressManager from '@/components/user/AddressManager';

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserOrders();
  }, [user, navigate]);

  const fetchUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_info->>email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ في تحميل الطلبات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً!"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const userStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    pendingOrders: orders.filter(o => ['placed', 'processing', 'shipped'].includes(o.status)).length
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - Kledje</title>
        <meta name="description" content="إدارة حسابك وطلباتك في متجر Kledje" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-fuchsia-900/20 dark:to-purple-900/20">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Welcome Section */}
            <div className="mb-8">
              <Card className="glass-effect border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold gradient-text">
                          مرحباً بك!
                        </h1>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards */}
            <UserStats userStats={userStats} />

            {/* Main Content */}
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders">طلباتي</TabsTrigger>
                <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
                <TabsTrigger value="favorites">المفضلة</TabsTrigger>
                <TabsTrigger value="addresses">العناوين</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <OrdersList orders={orders} loading={loading} />
              </TabsContent>

              <TabsContent value="profile">
                <UserProfileEditor />
              </TabsContent>

              <TabsContent value="favorites">
                <UserFavoritesManager />
              </TabsContent>

              <TabsContent value="addresses">
                <AddressManager />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default UserDashboard;