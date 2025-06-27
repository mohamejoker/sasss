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

const ProductsTab = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [newProduct, setNewProduct] = useState({
    name: '', nameEn: '', price: '', originalPrice: '', image: '', category: '', description: '', ingredients: '', discount: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    const product = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
      discount: newProduct.discount ? parseInt(newProduct.discount) : 0,
      ingredients: newProduct.ingredients.split(',').map(item => item.trim())
    };
    addProduct(product);
    setNewProduct({ name: '', nameEn: '', price: '', originalPrice: '', image: '', category: '', description: '', ingredients: '', discount: '' });
  };

  const handleUpdateProduct = (id, updates) => {
    const updatedProduct = {
      ...updates,
      price: parseFloat(updates.price),
      originalPrice: updates.originalPrice ? parseFloat(updates.originalPrice) : null,
      discount: updates.discount ? parseInt(updates.discount) : 0,
      ingredients: typeof updates.ingredients === 'string' ? updates.ingredients.split(',').map(item => item.trim()) : updates.ingredients
    };
    updateProduct(id, updatedProduct);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse"><Plus className="w-5 h-5" /><span>إضافة منتج جديد</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="name">اسم المنتج *</Label><Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="كريم مخمريا" /></div>
            <div><Label htmlFor="nameEn">الاسم بالإنجليزية</Label><Input id="nameEn" value={newProduct.nameEn} onChange={(e) => setNewProduct({...newProduct, nameEn: e.target.value})} placeholder="Mekhmarya Cream" /></div>
            <div><Label htmlFor="price">السعر *</Label><Input id="price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="225" /></div>
            <div><Label htmlFor="originalPrice">السعر الأصلي</Label><Input id="originalPrice" type="number" value={newProduct.originalPrice} onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} placeholder="300" /></div>
            <div><Label htmlFor="category">الفئة *</Label><Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}><SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div><Label htmlFor="discount">نسبة الخصم (%)</Label><Input id="discount" type="number" value={newProduct.discount} onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})} placeholder="25" /></div>
          </div>
          <div><Label htmlFor="image">رابط الصورة</Label><Input id="image" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://example.com/image.jpg" /></div>
          <div><Label htmlFor="description">الوصف</Label><Textarea id="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="وصف المنتج..." /></div>
          <div><Label htmlFor="ingredients">المكونات (مفصولة بفاصلة)</Label><Input id="ingredients" value={newProduct.ingredients} onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})} placeholder="شمع العسل, فازلين" /></div>
          <Button onClick={handleAddProduct} className="w-full">إضافة المنتج</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>المنتجات الحالية ({products.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-sm">{product.name}</h3>
                    <div className="flex space-x-1 space-x-reverse">
                      <Dialog><DialogTrigger asChild><Button size="icon" variant="ghost" onClick={() => setEditingProduct(product)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button></DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader><DialogTitle>تعديل المنتج</DialogTitle></DialogHeader>
                          {editingProduct && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div><Label>اسم المنتج</Label><Input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
                                <div><Label>السعر</Label><Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} /></div>
                              </div>
                              <div><Label>الوصف</Label><Textarea value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} /></div>
                              <div className="flex items-center space-x-2 space-x-reverse"><Switch checked={editingProduct.featured} onCheckedChange={(c) => setEditingProduct({...editingProduct, featured: c})} /><Label>منتج مميز</Label></div>
                              <div className="flex items-center space-x-2 space-x-reverse"><Switch checked={editingProduct.inStock} onCheckedChange={(c) => setEditingProduct({...editingProduct, inStock: c})} /><Label>متوفر</Label></div>
                              <Button onClick={() => handleUpdateProduct(editingProduct.id, editingProduct)} className="w-full">حفظ التغييرات</Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" onClick={() => deleteProduct(product.id)} className="w-8 h-8 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs">{product.category}</Badge>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{product.price} ج.م</span>
                    <div className="flex space-x-1 space-x-reverse">
                      {product.featured && <Badge className="text-xs">مميز</Badge>}
                      {product.inStock ? <Badge variant="secondary" className="text-xs text-green-600">متوفر</Badge> : <Badge variant="destructive" className="text-xs">غير متوفر</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsTab;