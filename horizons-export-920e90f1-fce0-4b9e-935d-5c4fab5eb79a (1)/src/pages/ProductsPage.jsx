import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  'الكل',
  'العناية بالبشرة',
  'العناية بالشعر',
  'العناية الشخصية',
  'العطور',
  'مجموعات خاصة'
];

const ProductsPage = () => {
  const { products } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.name_en && product.name_en.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(product =>
      selectedCategory === 'الكل' || product.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <>
      <Helmet>
        <title>المتجر - Kledje</title>
        <meta name="description" content="تصفح جميع منتجات Kledje للعناية الفاخرة." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text">متجرنا</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              اكتشفي تشكيلتنا الكاملة من المنتجات الطبيعية
            </p>
          </motion.div>

          <Card className="mb-8 p-4 glass-effect border-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ابحثي عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">افتراضي</SelectItem>
                  <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="name-asc">الاسم: أ-ي</SelectItem>
                  <SelectItem value="name-desc">الاسم: ي-أ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`}>
                  <Card className="product-card-hover glass-effect border-0 overflow-hidden group h-full flex flex-col">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          خصم {product.discount}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs">{product.category}</Badge>
                        <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-primary">{product.price} ج.م</span>
                        {product.original_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.original_price} ج.م
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">لا توجد منتجات تطابق بحثك.</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;