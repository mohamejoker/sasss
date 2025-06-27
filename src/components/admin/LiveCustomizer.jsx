
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layout, Save, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/lib/supabaseClient';

const LiveCustomizer = () => {
  const { siteSettings, updateSiteSettings } = useAdmin();
  const [localSettings, setLocalSettings] = useState(siteSettings);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setLocalSettings(siteSettings);
  }, [siteSettings]);

  const handleColorChange = (colorType, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [colorType]: value
    }));
    
    if (previewMode) {
      // Apply changes immediately to CSS variables
      document.documentElement.style.setProperty(`--${colorType}`, value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(localSettings)
        .eq('id', 1);

      if (error) throw error;

      await updateSiteSettings();
      
      // Apply changes to CSS variables
      Object.entries(localSettings).forEach(([key, value]) => {
        if (key.includes('color')) {
          document.documentElement.style.setProperty(`--${key}`, value);
        }
      });

      toast({
        title: "تم حفظ التغييرات بنجاح",
        description: "تم تطبيق التصميم الجديد على الموقع"
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ التغييرات",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(siteSettings);
    toast({
      title: "تم إعادة تعيين التغييرات",
      description: "تم استرجاع الإعدادات المحفوظة"
    });
  };

  const colorPresets = [
    { name: 'الأزرق الكلاسيكي', primary: '#3b82f6', secondary: '#1e40af' },
    { name: 'الوردي العصري', primary: '#ec4899', secondary: '#be185d' },
    { name: 'الأخضر الطبيعي', primary: '#10b981', secondary: '#047857' },
    { name: 'البرتقالي النابض', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'البنفسجي الملكي', primary: '#8b5cf6', secondary: '#7c3aed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">مخصص الواجهة المباشر</h2>
          <p className="text-muted-foreground">تخصيص شامل لمظهر الموقع مع معاينة فورية</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              checked={previewMode}
              onCheckedChange={setPreviewMode}
            />
            <Label>معاينة مباشرة</Label>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white">
            <Save className="w-4 h-4 ml-2" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">الألوان</TabsTrigger>
          <TabsTrigger value="typography">الخطوط</TabsTrigger>
          <TabsTrigger value="layout">التخطيط</TabsTrigger>
          <TabsTrigger value="content">المحتوى</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Palette className="w-5 h-5" />
                  <span>الألوان الأساسية</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>اللون الأساسي</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Input
                      type="color"
                      value={localSettings.primary_color || '#ec4899'}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localSettings.primary_color || '#ec4899'}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      placeholder="#ec4899"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>اللون الثانوي</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Input
                      type="color"
                      value={localSettings.secondary_color || '#be185d'}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localSettings.secondary_color || '#be185d'}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      placeholder="#be185d"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>قوالب الألوان الجاهزة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {colorPresets.map((preset, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        handleColorChange('primary_color', preset.primary);
                        handleColorChange('secondary_color', preset.secondary);
                      }}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex space-x-1 space-x-reverse">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <span className="font-medium">{preset.name}</span>
                      </div>
                      <Button size="sm" variant="ghost">تطبيق</Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Type className="w-5 h-5" />
                <span>إعدادات الخطوط</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>عنوان الصفحة الرئيسية</Label>
                <Input
                  value={localSettings.hero_title || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="اكتشف عالم الجمال الطبيعي"
                />
              </div>

              <div className="space-y-2">
                <Label>العنوان الفرعي</Label>
                <Input
                  value={localSettings.hero_subtitle || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  placeholder="منتجات عناية طبيعية عالية الجودة"
                />
              </div>

              <div className="space-y-2">
                <Label>اسم الموقع</Label>
                <Input
                  value={localSettings.site_name || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="Kledje"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Layout className="w-5 h-5" />
                <span>تخطيط الصفحة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>عرض الشريط الجانبي</Label>
                  <Switch
                    checked={localSettings.sidebar_enabled || false}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, sidebar_enabled: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>عدد المنتجات في الصف</Label>
                  <Slider
                    value={[localSettings.products_per_row || 4]}
                    onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, products_per_row: value }))}
                    max={6}
                    min={2}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    {localSettings.products_per_row || 4} منتجات في الصف
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label>إظهار شريط التقدم</Label>
                  <Switch
                    checked={localSettings.show_progress_bar || true}
                    onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, show_progress_bar: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المحتوى</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>رسالة الترحيب</Label>
                <Input
                  value={localSettings.welcome_message || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, welcome_message: e.target.value }))}
                  placeholder="مرحباً بك في متجرنا"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الواتساب</Label>
                <Input
                  value={localSettings.whatsapp_number || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="+201234567890"
                />
              </div>

              <div className="space-y-2">
                <Label>رسالة الواتساب الافتراضية</Label>
                <Input
                  value={localSettings.whatsapp_message || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, whatsapp_message: e.target.value }))}
                  placeholder="مرحباً، أريد الاستفسار عن منتجاتكم"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {previewMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <Eye className="w-4 h-4" />
            <span>وضع المعاينة المباشرة مفعل</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LiveCustomizer;
