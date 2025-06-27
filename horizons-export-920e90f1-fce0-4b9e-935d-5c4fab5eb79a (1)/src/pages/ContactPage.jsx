import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { siteSettings } = useAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "👍 تم استلام رسالتك",
      description: "شكرًا لتواصلك معنا، سنقوم بالرد في أقرب وقت ممكن.",
    });
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>اتصل بنا - Kledje</title>
        <meta name="description" content="تواصل مع فريق Kledje لأي استفسارات أو مساعدة." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text">اتصلي بنا</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              نحن هنا لمساعدتك! تواصلي معنا لأي استفسار.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full glass-effect border-0">
                <CardHeader>
                  <CardTitle>أرسلي لنا رسالة</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">الاسم</Label>
                      <Input id="name" placeholder="اسمك الكامل" required />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" placeholder="example@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="message">رسالتك</Label>
                      <Textarea id="message" placeholder="اكتبي رسالتك هنا..." rows={5} required />
                    </div>
                    <Button type="submit" className="w-full gradient-bg text-white font-bold">
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>معلومات التواصل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">الهاتف</h3>
                      <p className="text-muted-foreground" dir="ltr">{siteSettings.contact_info?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground">{siteSettings.contact_info?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">العنوان</h3>
                      <p className="text-muted-foreground">{siteSettings.contact_info?.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="w-full h-64 rounded-2xl overflow-hidden">
                <img  class="w-full h-full object-cover" alt="خريطة موقع المكتب" src="https://images.unsplash.com/photo-1703197081241-bb861e2902b7" />
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;