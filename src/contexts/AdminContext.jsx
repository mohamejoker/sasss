import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const initialSiteSettings = {
  site_name: 'Kledje',
  primary_color: '#f78fb3',
  secondary_color: '#e5b2ca',
  hero_title: 'دللي جمالك بلمسة من الطبيعة',
  hero_subtitle: 'منتجاتنا مصنوعة بحب وشغف لتبرز تألقك الفريد',
  contact_info: {
    phone: '+20 100 123 4567',
    email: 'info@kledje.com',
    address: 'القاهرة، مصر'
  }
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kledje-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsPromise = supabase.from('products').select('*').order('id');
        const offersPromise = supabase.from('offers').select('*').order('id');
        const settingsPromise = supabase.from('site_settings').select('*').eq('id', 1).single();

        const [{ data: productsData, error: productsError }, { data: offersData, error: offersError }, { data: settingsData, error: settingsError }] = await Promise.all([productsPromise, offersPromise, settingsPromise]);

        if (productsError) throw productsError;
        if (offersError) throw offersError;
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

        setProducts(productsData || []);
        setOffers(offersData || []);
        if (settingsData) {
          setSiteSettings(settingsData);
        } else {
          const { error: insertError } = await supabase.from('site_settings').insert([{ id: 1, ...initialSiteSettings }]);
          if (insertError) throw insertError;
          setSiteSettings(initialSiteSettings);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "خطأ في تحميل البيانات", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('kledje-cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else if (data) {
      setProducts(prev => [...prev, ...data]);
      toast({ title: "تم إضافة المنتج بنجاح" });
    }
  };

  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else if (data) {
      setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
      toast({ title: "تم تحديث المنتج" });
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "تم حذف المنتج" });
    }
  };

  const addOffer = async (offer) => {
    const { data, error } = await supabase.from('offers').insert([offer]).select();
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else if (data) {
      setOffers(prev => [...prev, ...data]);
      toast({ title: "تم إضافة العرض" });
    }
  };

  const updateOffer = async (id, updates) => {
    const { data, error } = await supabase.from('offers').update(updates).eq('id', id).select();
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else if (data) {
      setOffers(prev => prev.map(o => o.id === id ? data[0] : o));
      toast({ title: "تم تحديث العرض" });
    }
  };

  const deleteOffer = async (id) => {
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setOffers(prev => prev.filter(o => o.id !== id));
      toast({ title: "تم حذف العرض" });
    }
  };

  const updateSiteSettings = async (settings) => {
    const newSettings = { ...siteSettings, ...settings, id: 1, updated_at: new Date().toISOString() };
    setSiteSettings(newSettings);
    const { error } = await supabase.from('site_settings').upsert(newSettings);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم تحديث الإعدادات" });
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast({
      title: "تمت الإضافة إلى السلة بنجاح",
      description: `تم إضافة ${product.name} إلى سلة التسوق`
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج من سلة التسوق"
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <AdminContext.Provider value={{
      products,
      offers,
      siteSettings,
      cart,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      addOffer,
      updateOffer,
      deleteOffer,
      updateSiteSettings,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </AdminContext.Provider>
  );
};