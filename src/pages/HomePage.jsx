import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturesSection from '@/components/FeaturesSection';
import OffersSection from '@/components/OffersSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import { useAdmin } from '@/contexts/AdminContext';

const HomePage = () => {
  const { siteSettings } = useAdmin();

  return (
    <>
      <Helmet>
        <title>{siteSettings.site_name || 'Kledje'} - متجر منتجات العناية الفاخرة</title>
        <meta name="description" content={`اكتشفي مجموعة ${siteSettings.site_name || 'Kledje'} الفريدة من منتجات العناية الطبيعية عالية الجودة. كريمات ومنتجات طبيعية للعناية بالبشرة والشعر.`} />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ProductGrid />
          <CategoryGrid />
          <OffersSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;