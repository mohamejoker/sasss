import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye, Star, Package } from 'lucide-react';
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
import { formatPrice } from '@/utils/formatters';
import { PRODUCT_CATEGORIES } from '@/constants';

const ProductsManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_en: '',
    price: '',
    original_price: '',
    image: '',
    category: '',
    description: '',
    ingredients: '',
    discount: '',
    featured: false,
    in_stock: true
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
      discount: newProduct.discount ? parseInt(newProduct.discount) : 0,
      ingredients: newProduct.ingredients.split(',').map(item => item.trim()).filter(item => item)
    };

    await addProduct(productData);
    setNewProduct({
      name: '',
      name_en: '',
      price: '',
      original_price: '',
      image: '',
      category: '',
      description: '',
      ingredients: '',
      discount: '',
      featured: false,
      in_stock: true
    });
    setIsAddDialogOpen(false);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const productData = {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      original_price: editingProduct.original_price ? parseFloat(editingProduct.original_price) : null,
      discount: editingProduct.discount ? parseInt(editingProduct.discount) : 0,
      ingredients: typeof editingProduct.ingredients === 'string' 
        ? editingProduct.ingredients.split(',').map(item => item.trim()).filter(item => item)
        : editingProduct.ingredients
    };

    await updateProduct(editingProduct.id, productData);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await deleteProduct(id);
    }
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
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-muted-foreground">إدارة شاملة لجميع منتجات المتجر</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-white">
              <Plus className="w-4 h-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم المنتج *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="كريم مخمريا الطبيعي"
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                  <Input
                    id="name_en"
                    value={newProduct.name_en}
                    onChange={(e) => setNewProduct({...newProduct, name_en: e.target.value})}
                    placeholder="Natural Mekhmarya Cream"
                  />
                </div>
                <div>
                  <Label htmlFor="price">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="225"
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">السعر الأصلي (ج.م)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة *</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount">نسبة الخصم (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                    placeholder="25"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image">رابط الصورة</Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="وصف تفصيلي للمنتج..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="ingredients">المكونات (مفصولة بفاصلة)</Label>
                <Input
                  id="ingredients"
                  value={newProduct.ingredients}
                  onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                  placeholder="شمع العسل, زيت الأرجان, فازلين طبي"
                />
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={newProduct.featured}
                    onCheckedChange={(checked) => setNewProduct({...newProduct, featured: checked})}
                  />
                  <Label>منتج مميز</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={newProduct.in_stock}
                    onCheckedChange={(checked) => setNewProduct({...newProduct, in_stock: checked})}
                  />
                  <Label>متوفر في المخزون</Label>
                </div>
              </div>
              
              <Button onClick={handleAddProduct} className="w-full">
                إضافة المنتج
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="جميع الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {PRODUCT_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">منتجات متوفرة</p>
                <p className="text-2xl font-bold text-green-600">{products.filter(p => p.in_stock).length}</p>
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
                <p className="text-sm text-muted-foreground">منتجات مميزة</p>
                <p className="text-2xl font-bold text-yellow-600">{products.filter(p => p.featured).length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">منتجات بخصم</p>
                <p className="text-2xl font-bold text-red-600">{products.filter(p => p.discount > 0).length}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                %
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    -{product.discount}%
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                    <Star className="w-3 h-3 ml-1" />
                    مميز
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  
                  <h3 className="font-bold text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    <Badge variant={product.in_stock ? "default" : "destructive"} className="text-xs">
                      {product.in_stock ? "متوفر" : "غير متوفر"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-1 space-x-reverse">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم المنتج</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>السعر (ج.م)</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <Label>السعر الأصلي (ج.م)</Label>
                  <Input
                    type="number"
                    value={editingProduct.original_price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, original_price: e.target.value})}
                  />
                </div>
                <div>
                  <Label>نسبة الخصم (%)</Label>
                  <Input
                    type="number"
                    value={editingProduct.discount || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, discount: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={editingProduct.featured}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, featured: checked})}
                  />
                  <Label>منتج مميز</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={editingProduct.in_stock}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, in_stock: checked})}
                  />
                  <Label>متوفر في المخزون</Label>
                </div>
              </div>
              
              <Button onClick={handleUpdateProduct} className="w-full">
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد منتجات</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? 'لا توجد منتجات تطابق معايير البحث'
              : 'ابدأ بإضافة منتجات جديدة لمتجرك'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductsManagement;