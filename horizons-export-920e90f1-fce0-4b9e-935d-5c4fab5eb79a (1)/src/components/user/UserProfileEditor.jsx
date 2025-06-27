
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';

const UserProfileEditor = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const profileData = {
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;
      if (existingProfile) {
        ({ error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', user.id));
      } else {
        ({ error } = await supabase
          .from('user_profiles')
          .insert([{ ...profileData, created_at: new Date().toISOString() }]));
      }

      if (error) throw error;

      setEditing(false);
      toast({
        title: "تم حفظ الملف الشخصي",
        description: "تم تحديث معلوماتك بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ البيانات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <User className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">الملف الشخصي</h2>
            <p className="text-muted-foreground">إدارة معلوماتك الشخصية</p>
          </div>
        </div>
        
        {!editing ? (
          <Button onClick={() => setEditing(true)} variant="outline">
            <Edit className="w-4 h-4 ml-2" />
            تعديل
          </Button>
        ) : (
          <div className="flex space-x-2 space-x-reverse">
            <Button onClick={() => setEditing(false)} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 ml-2" />
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
              <p className="text-xs text-muted-foreground">
                لا يمكن تغيير البريد الإلكتروني
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">الاسم الأول</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  disabled={!editing}
                  placeholder="أدخل اسمك الأول"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">اسم العائلة</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  disabled={!editing}
                  placeholder="أدخل اسم العائلة"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!editing}
                placeholder="+201234567890"
                type="tel"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات العنوان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!editing}
                placeholder="القاهرة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان التفصيلي</Label>
              <Textarea
                id="address"
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!editing}
                placeholder="أدخل عنوانك التفصيلي..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <Edit className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">وضع التعديل مفعل</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                يمكنك الآن تعديل معلوماتك الشخصية. لا تنس حفظ التغييرات.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfileEditor;
