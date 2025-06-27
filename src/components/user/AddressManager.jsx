
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';

const AddressManager = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "خطأ في تحميل العناوين",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const addressData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      // If setting as default, remove default from other addresses
      if (formData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      let error;
      if (editingAddress) {
        ({ error } = await supabase
          .from('user_addresses')
          .update(addressData)
          .eq('id', editingAddress.id));
      } else {
        ({ error } = await supabase
          .from('user_addresses')
          .insert([{ ...addressData, created_at: new Date().toISOString() }]));
      }

      if (error) throw error;

      await fetchAddresses();
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: editingAddress ? "تم تحديث العنوان" : "تم إضافة العنوان",
        description: "تم حفظ العنوان بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ العنوان",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      await fetchAddresses();
      toast({
        title: "تم حذف العنوان",
        description: "تم حذف العنوان بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في حذف العنوان",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      // Remove default from all addresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set new default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      await fetchAddresses();
      toast({
        title: "تم تحديث العنوان الافتراضي",
        description: "تم تعيين العنوان كافتراضي"
      });
    } catch (error) {
      toast({
        title: "خطأ في تحديث العنوان",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const openDialog = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      is_default: false
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
          <MapPin className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">إدارة العناوين</h2>
            <p className="text-muted-foreground">{addresses.length} عنوان محفوظ</p>
          </div>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة عنوان جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان العنوان</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="المنزل، العمل، إلخ..."
                />
              </div>

              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+201234567890"
                />
              </div>

              <div className="space-y-2">
                <Label>العنوان الأول</Label>
                <Input
                  value={formData.address_line1}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
                  placeholder="الشارع والرقم"
                />
              </div>

              <div className="space-y-2">
                <Label>العنوان الثاني (اختياري)</Label>
                <Input
                  value={formData.address_line2}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
                  placeholder="الشقة، الطابق، إلخ..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="القاهرة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>الرمز البريدي</Label>
                  <Input
                    value={formData.postal_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>تعيين كعنوان افتراضي</Label>
                <Switch
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                />
              </div>

              <div className="flex space-x-2 space-x-reverse pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  {editingAddress ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2 space-x-reverse">
                        <span>{address.title}</span>
                        {address.is_default && (
                          <Badge variant="default" className="text-xs">
                            افتراضي
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex space-x-1 space-x-reverse">
                        {!address.is_default && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDialog(address)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(address.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{address.full_name}</p>
                      <p className="text-muted-foreground">{address.phone}</p>
                      <p className="text-muted-foreground">
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                      </p>
                      <p className="text-muted-foreground">
                        {address.city}
                        {address.postal_code && ` ${address.postal_code}`}
                      </p>
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
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد عناوين محفوظة</h3>
            <p className="text-muted-foreground mb-4">
              أضف عنوانك لتسهيل عملية الطلب والتوصيل
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة عنوان جديد
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressManager;
