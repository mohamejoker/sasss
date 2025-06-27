import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/contexts/AdminContext';

const SettingsTab = () => {
  const { siteSettings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>إعدادات الموقع</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="siteName">اسم الموقع</Label><Input id="siteName" value={siteSettings.site_name || ''} onChange={(e) => updateSiteSettings({site_name: e.target.value})} /></div>
          <div><Label htmlFor="heroTitle">عنوان الصفحة الرئيسية</Label><Input id="heroTitle" value={siteSettings.hero_title || ''} onChange={(e) => updateSiteSettings({hero_title: e.target.value})} /></div>
          <div><Label htmlFor="heroSubtitle">العنوان الفرعي</Label><Textarea id="heroSubtitle" value={siteSettings.hero_subtitle || ''} onChange={(e) => updateSiteSettings({hero_subtitle: e.target.value})} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="primaryColor">اللون الأساسي</Label><Input id="primaryColor" type="color" value={siteSettings.primary_color || '#f78fb3'} onChange={(e) => updateSiteSettings({primary_color: e.target.value})} /></div>
            <div><Label htmlFor="secondaryColor">اللون الثانوي</Label><Input id="secondaryColor" type="color" value={siteSettings.secondary_color || '#e5b2ca'} onChange={(e) => updateSiteSettings({secondary_color: e.target.value})} /></div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">معلومات التواصل</h3>
            <div><Label htmlFor="phone">رقم الهاتف</Label><Input id="phone" value={siteSettings.contact_info?.phone || ''} onChange={(e) => updateSiteSettings({contact_info: {...siteSettings.contact_info, phone: e.target.value}})} /></div>
            <div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" type="email" value={siteSettings.contact_info?.email || ''} onChange={(e) => updateSiteSettings({contact_info: {...siteSettings.contact_info, email: e.target.value}})} /></div>
            <div><Label htmlFor="address">العنوان</Label><Textarea id="address" value={siteSettings.contact_info?.address || ''} onChange={(e) => updateSiteSettings({contact_info: {...siteSettings.contact_info, address: e.target.value}})} /></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;