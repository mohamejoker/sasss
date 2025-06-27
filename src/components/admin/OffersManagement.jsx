import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Tag, Calendar, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';
import { PRODUCT_CATEGORIES } from '@/constants';

const OffersManagement = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    end_date: '',
    category: '',
    active: true
  });

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOffer = async () => {
    if (!newOffer.title || !newOffer.discount || !newOffer.end_date) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const offerData = {
      ...newOffer,
      discount: parseInt(newOffer.discount)
    };

    await addOffer(offerData);
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      end_date: '',
      category: '',
      active: true
    });
    setIsAddDialogOpen(false);
  };

  const handleUpdateOffer = async () => {
    if (!editingOffer) return;

    const offerData = {
      ...editingOffer,
      discount: parseInt(editingOffer.discount)
    };

    await updateOffer(editingOffer.id, offerData);
    setEditingOffer(null);
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
      await deleteOffer(id);
    }
  };

  const isOfferExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const activeOffers = offers.filter(o => o.active && !isOfferExpired(o.end_date));
  const expiredOffers = offers.filter(o => isOfferExpired(o.end_date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">إدارة العروض</h1>
          <p className="text-muted-foreground">إنشاء وإدارة العروض والخصومات</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-white">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عرض جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة عرض جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان العرض *</Label>
                  <Input
                    id="title"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                    placeholder="عرض الجمعة البيضاء"
                  />
                </div>
                <div>
                  <Label htmlFor="discount">نسبة الخصم (%) *</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                    placeholder="30"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">تاريخ انتهاء العرض *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={newOffer.end_date}
                    onChange={(e) => setNewOffer({...newOffer, end_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة المستهدفة</Label>
                  <Select value={newOffer.category} onValueChange={(value) => setNewOffer({...newOffer, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة (اختياري)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع الفئات</SelectItem>
                      {PRODUCT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">وصف العرض</Label>
                <Textarea
                  id="description"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  placeholder="وصف تفصيلي للعرض..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={newOffer.active}
                  onCheckedChange={(checked) => setNewOffer({...newOffer, active: checked})}
                />
                <Label>عرض نشط</Label>
              </div>
              
              <Button onClick={handleAddOffer} className="w-full">
                إضافة العرض
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العروض</p>
                <p className="text-2xl font-bold">{offers.length}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">عروض نشطة</p>
                <p className="text-2xl font-bold text-green-600">{activeOffers.length}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">عروض منتهية</p>
                <p className="text-2xl font-bold text-red-600">{expiredOffers.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوسط الخصم</p>
                <p className="text-2xl font-bold text-purple-600">
                  {offers.length > 0 
                    ? Math.round(offers.reduce((sum, o) => sum + o.discount, 0) / offers.length)
                    : 0}%
                </p>
              </div>
              <Percent className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="البحث في العروض..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </motion.div>

      {/* Offers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredOffers.map((offer, index) => {
          const isExpired = isOfferExpired(offer.end_date);
          
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isExpired ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                      {offer.category && (
                        <Badge variant="outline" className="mt-2">
                          {offer.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-red-500 text-white text-lg font-bold">
                        -{offer.discount}%
                      </Badge>
                      {offer.active && !isExpired ? (
                        <Badge className="bg-green-500 text-white">نشط</Badge>
                      ) : isExpired ? (
                        <Badge className="bg-gray-500 text-white">منتهي</Badge>
                      ) : (
                        <Badge variant="secondary">غير نشط</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {offer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {offer.description}
                    </p>
                  )}
                  
                  <div className="text-sm">
                    <p className="font-medium">ينتهي في:</p>
                    <p className={`${isExpired ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {new Date(offer.end_date).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      تم الإنشاء: {new Date(offer.created_at).toLocaleDateString('ar-EG')}
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8"
                        onClick={() => setEditingOffer(offer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Edit Offer Dialog */}
      <Dialog open={!!editingOffer} onOpenChange={() => setEditingOffer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل العرض</DialogTitle>
          </DialogHeader>
          {editingOffer && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>عنوان العرض</Label>
                  <Input
                    value={editingOffer.title}
                    onChange={(e) => setEditingOffer({...editingOffer, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>نسبة الخصم (%)</Label>
                  <Input
                    type="number"
                    value={editingOffer.discount}
                    onChange={(e) => setEditingOffer({...editingOffer, discount: e.target.value})}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label>تاريخ انتهاء العرض</Label>
                  <Input
                    type="datetime-local"
                    value={editingOffer.end_date ? new Date(editingOffer.end_date).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingOffer({...editingOffer, end_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>الفئة المستهدفة</Label>
                  <Select value={editingOffer.category || ''} onValueChange={(value) => setEditingOffer({...editingOffer, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع الفئات</SelectItem>
                      {PRODUCT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>وصف العرض</Label>
                <Textarea
                  value={editingOffer.description || ''}
                  onChange={(e) => setEditingOffer({...editingOffer, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={editingOffer.active}
                  onCheckedChange={(checked) => setEditingOffer({...editingOffer, active: checked})}
                />
                <Label>عرض نشط</Label>
              </div>
              
              <Button onClick={handleUpdateOffer} className="w-full">
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredOffers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد عروض</h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'لا توجد عروض تطابق معايير البحث'
              : 'ابدأ بإنشاء عروض جذابة لعملائك'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OffersManagement;