import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const categories = [
  'العناية بالبشرة',
  'العناية بالشعر',
  'العناية الشخصية',
  'العطور',
  'مجموعات خاصة'
];

const OffersTab = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useAdmin();
  const [newOffer, setNewOffer] = useState({
    title: '', description: '', discount: '', endDate: '', category: ''
  });
  const [editingOffer, setEditingOffer] = useState(null);

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.discount || !newOffer.endDate) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    const offer = { ...newOffer, discount: parseInt(newOffer.discount) };
    addOffer(offer);
    setNewOffer({ title: '', description: '', discount: '', endDate: '', category: '' });
  };

  const handleUpdateOffer = (id, updates) => {
    const updatedOffer = { ...updates, discount: parseInt(updates.discount) };
    updateOffer(id, updatedOffer);
    setEditingOffer(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center space-x-2 space-x-reverse"><Plus className="w-5 h-5" /><span>إضافة عرض جديد</span></CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="offerTitle">عنوان العرض *</Label><Input id="offerTitle" value={newOffer.title} onChange={(e) => setNewOffer({...newOffer, title: e.target.value})} placeholder="عرض خاص - خصم 30%" /></div>
            <div><Label htmlFor="offerDiscount">نسبة الخصم (%) *</Label><Input id="offerDiscount" type="number" value={newOffer.discount} onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})} placeholder="30" /></div>
            <div><Label htmlFor="offerEndDate">تاريخ انتهاء العرض *</Label><Input id="offerEndDate" type="datetime-local" value={newOffer.endDate} onChange={(e) => setNewOffer({...newOffer, endDate: e.target.value})} /></div>
            <div><Label htmlFor="offerCategory">الفئة المستهدفة</Label><Select value={newOffer.category} onValueChange={(value) => setNewOffer({...newOffer, category: value})}><SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label htmlFor="offerDescription">وصف العرض</Label><Textarea id="offerDescription" value={newOffer.description} onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} placeholder="وصف العرض..." /></div>
          <Button onClick={handleAddOffer} className="w-full">إضافة العرض</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>العروض الحالية ({offers.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offers.map(offer => (
              <Card key={offer.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <h3 className="font-bold">{offer.title}</h3>
                      <Badge className="bg-red-500 text-white">-{offer.discount}%</Badge>
                      {offer.active ? <Badge className="bg-green-500 text-white">نشط</Badge> : <Badge variant="secondary">غير نشط</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-2">{offer.description}</p>
                    <div className="text-sm text-muted-foreground">ينتهي في: {new Date(offer.endDate).toLocaleDateString('ar-EG')}</div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Dialog><DialogTrigger asChild><Button size="icon" variant="ghost" onClick={() => setEditingOffer(offer)}><Edit className="w-4 h-4" /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>تعديل العرض</DialogTitle></DialogHeader>
                        {editingOffer && (
                          <div className="space-y-4">
                            <div><Label>عنوان العرض</Label><Input value={editingOffer.title} onChange={(e) => setEditingOffer({...editingOffer, title: e.target.value})} /></div>
                            <div><Label>نسبة الخصم</Label><Input type="number" value={editingOffer.discount} onChange={(e) => setEditingOffer({...editingOffer, discount: e.target.value})} /></div>
                            <div><Label>الوصف</Label><Textarea value={editingOffer.description} onChange={(e) => setEditingOffer({...editingOffer, description: e.target.value})} /></div>
                            <div className="flex items-center space-x-2 space-x-reverse"><Switch checked={editingOffer.active} onCheckedChange={(c) => setEditingOffer({...editingOffer, active: c})} /><Label>عرض نشط</Label></div>
                            <Button onClick={() => handleUpdateOffer(editingOffer.id, editingOffer)} className="w-full">حفظ التغييرات</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button size="icon" variant="ghost" onClick={() => deleteOffer(offer.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersTab;