
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const UserProfile = ({ user }) => {
  const handleEditProfile = () => {
    toast({
      title: "✏️ تعديل الملف الشخصي قيد التطوير",
      description: "🚧 هذه الميزة غير مطبقة بعد—لكن لا تقلق! يمكنك طلبها في رسالتك التالية! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <User className="w-5 h-5" />
            <span>الملف الشخصي</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">البريد الإلكتروني</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">رقم الهاتف</p>
                  <p className="text-muted-foreground">غير محدد</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">العنوان</p>
                  <p className="text-muted-foreground">غير محدد</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleEditProfile}
              >
                <Edit className="w-4 h-4 ml-2" />
                تعديل المعلومات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
