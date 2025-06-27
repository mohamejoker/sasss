import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';
import { formatPrice } from '@/utils/formatters';
import { PRODUCT_CATEGORIES } from '@/constants';

const InventoryManagement = () => {
  const { products, updateProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && product.in_stock) ||
      (stockFilter === 'out_of_stock' && !product.in_stock) ||
      (stockFilter === 'low_stock' && product.stock_quantity && product.stock_quantity < 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleUpdateStock = async (productId, updates) => {
    await updateProduct(productId, updates);
    setEditingProduct(null);
  };

  const inventoryStats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.in_stock).length,
    outOfStock: products.filter(p => !p.in_stock).length,
    lowStock: products.filter(p => p.stock_quantity && p.stock_quantity < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock_quantity || 0)), 0)
  };

  const getStockStatus = (product) => {
    if (!product.in_stock) return { label: 'نفد المخزون', color: 'bg-red-500', icon: AlertTriangle };
    if (product.stock_quantity && product.stock_quantity < 10) return { label: 'مخزون منخفض', color: 'bg-yellow-500', icon: AlertTriangle };
    return { label: 'متوفر', color: 'bg-green-500', icon: Package };
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
          <h1 className="text-3xl font-bold">إدارة المخزون</h1>
          <p className="text-muted-foreground">متابعة وإدارة مخزون المنتجات</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{inventoryStats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوفر</p>
                <p className="text-2xl font-bold text-green-600">{inventoryStats.inStock}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نفد المخزون</p>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مخزون منخفض</p>
                <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">قيمة المخزون</p>
                <p className="text-lg font-bold text-purple-600">{formatPrice(inventoryStats.totalValue)}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                ج.م
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
        
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="حالة المخزون" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المنتجات</SelectItem>
            <SelectItem value="in_stock">متوفر</SelectItem>
            <SelectItem value="low_stock">مخزون منخفض</SelectItem>
            <SelectItem value="out_of_stock">نفد المخزون</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة المنتجات ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center space-x-4 space-x-reverse flex-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-bold">{product.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {product.category}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            السعر: {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">الكمية</p>
                          <p className="text-lg font-bold">
                            {product.stock_quantity || 'غير محدد'}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">الحالة</p>
                          <Badge className={`${stockStatus.color} text-white`}>
                            <StatusIcon className="w-3 h-3 ml-1" />
                            {stockStatus.label}
                          </Badge>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>تحديث المخزون - {product.name}</DialogTitle>
                            </DialogHeader>
                            {editingProduct && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="stock_quantity">كمية المخزون</Label>
                                  <Input
                                    id="stock_quantity"
                                    type="number"
                                    value={editingProduct.stock_quantity || ''}
                                    onChange={(e) => setEditingProduct({
                                      ...editingProduct,
                                      stock_quantity: parseInt(e.target.value) || 0
                                    })}
                                    placeholder="0"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Switch
                                    checked={editingProduct.in_stock}
                                    onCheckedChange={(checked) => setEditingProduct({
                                      ...editingProduct,
                                      in_stock: checked
                                    })}
                                  />
                                  <Label>متوفر في المخزون</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Switch
                                    checked={editingProduct.featured}
                                    onCheckedChange={(checked) => setEditingProduct({
                                      ...editingProduct,
                                      featured: checked
                                    })}
                                  />
                                  <Label>منتج مميز</Label>
                                </div>
                                
                                <Button
                                  onClick={() => handleUpdateStock(editingProduct.id, editingProduct)}
                                  className="w-full"
                                >
                                  حفظ التغييرات
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد منتجات</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                      ? 'لا توجد منتجات تطابق معايير البحث'
                      : 'لا توجد منتجات في المخزون'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InventoryManagement;