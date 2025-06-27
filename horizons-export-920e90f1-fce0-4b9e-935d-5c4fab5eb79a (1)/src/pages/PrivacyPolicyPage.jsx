import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "مقدمة",
      content: "نحن في Kledje نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيف نجمع ونستخدم ونحمي معلوماتك عند زيارتك لموقعنا."
    },
    {
      title: "المعلومات التي نجمعها",
      content: "قد نجمع معلومات شخصية مثل الاسم، البريد الإلكتروني، رقم الهاتف، وعنوان الشحن عند قيامك بعملية شراء أو التسجيل في نشرتنا الإخبارية. كما نجمع بيانات غير شخصية مثل نوع المتصفح وعنوان IP لتحسين خدماتنا."
    },
    {
      title: "كيف نستخدم معلوماتك",
      content: "نستخدم معلوماتك لمعالجة طلباتك، تحسين تجربة التسوق الخاصة بك، إرسال تحديثات وعروض تسويقية (بعد موافقتك)، والامتثال للمتطلبات القانونية."
    },
    {
      title: "مشاركة البيانات",
      content: "نحن لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع شركاء موثوقين مثل شركات الشحن وبوابات الدفع فقط لغرض إتمام طلبك."
    },
    {
      title: "أمان البيانات",
      content: "نتخذ تدابير أمنية معقولة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الكشف. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%."
    },
    {
      title: "التغييرات على سياسة الخصوصية",
      content: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة. ننصحك بمراجعة هذه الصفحة بشكل دوري."
    }
  ];

  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية - Kledje</title>
        <meta name="description" content="تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية في Kledje." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text">سياسة الخصوصية</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              آخر تحديث: 20 يونيو 2025
            </p>
          </motion.div>

          <Card className="max-w-4xl mx-auto glass-effect border-0">
            <CardContent className="p-8 md:p-12 space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-bold text-primary">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;