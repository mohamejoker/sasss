
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { formatPrice } from '@/utils/formatters';

const UserFavoritesManager = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            name,
            price,
            original_price,
            image,
            category,
            in_stock,
            discount
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "خطأ في تحميل المفضلة",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId, productName) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast({
        title: "تم الحذف من المفضلة",
        description: `تم حذف "${productName}" من قائمة المفضلة`
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addToCart = (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast({
      title: "تم إضافة المنتج للسلة",
      description: `تم إضافة "${product.name}" إلى سلة التسوق`
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Heart className="w-6 h-6 text-red-500" />
          <div>
            <h2 className="text-xl font-bold">المنتجات المفضلة</h2>
            <p className="text-muted-foreground">{favorites.length} منتج في المفضلة</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={favorite.products.image}
                        alt={favorite.products.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      
                      {favorite.products.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          -{favorite.products.discount}%
                        </Badge>
                      )}
                      
                      {!favorite.products.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge variant="destructive">نفد من المخزون</Badge>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFavorite(favorite.id, favorite.products.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{favorite.products.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {favorite.products.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(favorite.products.price)}
                          </span>
                          {favorite.products.original_price && favorite.products.original_price > favorite.products.price && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              {formatPrice(favorite.products.original_price)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.8</span>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={() => addToCart(favorite.products)}
                        disabled={!favorite.products.in_stock}
                      >
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        {favorite.products.in_stock ? 'إضافة للسلة' : 'غير متوفر'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد منتجات مفضلة</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة منتجاتك المفضلة لتجدها هنا بسهولة
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              تصفح المنتجات
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserFavoritesManager;
