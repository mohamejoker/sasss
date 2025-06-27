import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Palette, Globe, Phone, Mail, MapPin, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const SiteSettings = () => {
  const { siteSettings, updateSiteSettings } = useAdmin();
  const [tempSettings, setTempSettings] = useState(siteSettings);

  const handleSave = async () => {
    await updateSiteSettings(tempSettings);
    toast({
      title: "تم حفظ الإعدادات بنجاح",
      description: "تم تحديث إعدادات الموقع"
    });
  };

  const handleColorChange = (colorType, value) => {
    setTempSettings({
      ...tempSettings,
      [colorType]: value
    });
  };

  const handleContactInfoChange = (field, value) => {
    setTempSettings({
      ...tempSettings,
      contact_info: {
        ...tempSettings.contact_info,
        [field]: value
      }
    });
  };

  const handleLogoUpload = () => {
    toast({
      title: "📷 رفع الشعار قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
          <p className="text-muted-foreground">إدارة إعدادات وتخصيص المتجر</p>
        </div>
        
        <Button onClick={handleSave} className="gradient-bg text-white">
          <Save className="w-4 h-4 ml-2" />
          حفظ جميع التغييرات
        </Button>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="advanced">متقدم</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Globe className="w-5 h-5" />
                  <span>الإعدادات العامة</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_name">اسم المتجر</Label>
                  <Input
                    id="site_name"
                    value={tempSettings.site_name || ''}
                    onChange={(e) => setTempSettings({...tempSettings, site_name: e.target.value})}
                    placeholder="Kledje"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero_title">العنوان الرئيسي</Label>
                  <Input
                    id="hero_title"
                    value={tempSettings.hero_title || ''}
                    onChange={(e) => setTempSettings({...tempSettings, hero_title: e.target.value})}
                    placeholder="دللي جمالك بلمسة من الطبيعة"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero_subtitle">العنوان الفرعي</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={tempSettings.hero_subtitle || ''}
                    onChange={(e) => setTempSettings({...tempSettings, hero_subtitle: e.target.value})}
                    placeholder="منتجاتنا مصنوعة بحب وشغف لتبرز تألقك الفريد"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">وصف المتجر</Label>
                  <Textarea
                    id="description"
                    value={tempSettings.description || ''}
                    onChange={(e) => setTempSettings({...tempSettings, description: e.target.value})}
                    placeholder="وصف مختصر عن المتجر ومنتجاته..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الشعار والصور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>شعار المتجر</Label>
                  <div className="flex items-center space-x-4 space-x-reverse mt-2">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                      K
                    </div>
                    <Button onClick={handleLogoUpload} variant="outline">
                      <Upload className="w-4 h-4 ml-2" />
                      رفع شعار جديد
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Palette className="w-5 h-5" />
                  <span>ألوان المتجر</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primary_color">اللون الأساسي</Label>
                    <div className="flex items-center space-x-3 space-x-reverse mt-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={tempSettings.primary_color || '#f78fb3'}
                        onChange={(e) => handleColorChange('primary_color', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={tempSettings.primary_color || '#f78fb3'}
                        onChange={(e) => handleColorChange('primary_color', e.target.value)}
                        placeholder="#f78fb3"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      يستخدم للأزرار والروابط والعناصر المهمة
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary_color">اللون الثانوي</Label>
                    <div className="flex items-center space-x-3 space-x-reverse mt-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={tempSettings.secondary_color || '#e5b2ca'}
                        onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={tempSettings.secondary_color || '#e5b2ca'}
                        onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                        placeholder="#e5b2ca"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      يستخدم للخلفيات والعناصر الثانوية
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold mb-3">معاينة الألوان</h4>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Button 
                      style={{ backgroundColor: tempSettings.primary_color }}
                      className="text-white"
                    >
                      زر أساسي
                    </Button>
                    <div 
                      className="px-4 py-2 rounded"
                      style={{ backgroundColor: tempSettings.secondary_color }}
                    >
                      عنصر ثانوي
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات التخطيط</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>نمط التخطيط</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <p className="text-sm font-medium">تخطيط كلاسيكي</p>
                    </div>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-primary">
                      <div className="w-full h-20 bg-gradient-to-r from-pink-200 to-purple-200 rounded mb-2"></div>
                      <p className="text-sm font-medium">تخطيط حديث (مُحدد)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="w-5 h-5" />
                  <span>معلومات التواصل</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4" />
                    <span>رقم الهاتف</span>
                  </Label>
                  <Input
                    id="phone"
                    value={tempSettings.contact_info?.phone || ''}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    placeholder="+20 100 123 4567"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center space-x-2 space-x-reverse">
                    <Mail className="w-4 h-4" />
                    <span>البريد الإلكتروني</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={tempSettings.contact_info?.email || ''}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    placeholder="info@kledje.com"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="flex items-center space-x-2 space-x-reverse">
                    <MapPin className="w-4 h-4" />
                    <span>العنوان</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={tempSettings.contact_info?.address || ''}
                    onChange={(e) => handleContactInfoChange('address', e.target.value)}
                    placeholder="القاهرة، مصر"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">رقم واتساب (للزر العائم)</Label>
                  <Input
                    id="whatsapp"
                    value={tempSettings.contact_info?.whatsapp || tempSettings.contact_info?.phone || ''}
                    onChange={(e) => handleContactInfoChange('whatsapp', e.target.value)}
                    placeholder="+20 100 123 4567"
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="working_hours">ساعات العمل</Label>
                  <Textarea
                    id="working_hours"
                    value={tempSettings.working_hours || ''}
                    onChange={(e) => setTempSettings({...tempSettings, working_hours: e.target.value})}
                    placeholder="السبت - الخميس: 9:00 ص - 6:00 م&#10;الجمعة: مغلق"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>إعدادات متقدمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo_title">عنوان SEO</Label>
                  <Input
                    id="seo_title"
                    value={tempSettings.seo_title || ''}
                    onChange={(e) => setTempSettings({...tempSettings, seo_title: e.target.value})}
                    placeholder="Kledje - متجر منتجات العناية الفاخرة"
                  />
                </div>
                
                <div>
                  <Label htmlFor="seo_description">وصف SEO</Label>
                  <Textarea
                    id="seo_description"
                    value={tempSettings.seo_description || ''}
                    onChange={(e) => setTempSettings({...tempSettings, seo_description: e.target.value})}
                    placeholder="اكتشف مجموعة Kledje الفريدة من منتجات العناية الطبيعية عالية الجودة..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="seo_keywords">كلمات مفتاحية</Label>
                  <Input
                    id="seo_keywords"
                    value={tempSettings.seo_keywords || ''}
                    onChange={(e) => setTempSettings({...tempSettings, seo_keywords: e.target.value})}
                    placeholder="kledje, كليدج, منتجات العناية, كريمات طبيعية"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    تنبيه أمني
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    تأكد من استخدام كلمات مرور قوية وتحديث النظام بانتظام للحفاظ على أمان متجرك.
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  تغيير كلمة مرور الإدارة
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;