import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Flame } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import CategorySlider from "@/components/home/CategorySlider";
import ScrollSofaCover3D from "@/components/home/ScrollSofaCover3D";
import OffersBanner from "@/components/home/OffersBanner";
import WhyUsSection from "@/components/home/WhyUsSection";
import SocialProofSection from "@/components/home/SocialProofSection";
import ProductGrid from "@/components/product/ProductGrid";
import { ProductService, CategoryService } from "@/lib/services/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [featuredProducts, categories, saleProducts] = await Promise.all([
    ProductService.getFeatured(),
    CategoryService.getAll(),
    ProductService.getSale(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Real Cover Image & High-Contrast Typography */}
      <HeroSection />

      {/* 2. Categories Section (Spacious Apple Cards) */}
      <CategorySlider categories={categories} />

      {/* 3. Interactive Sofa Bedding Draping Experience (Spreads across sofa as you scroll down) */}
      <ScrollSofaCover3D />

      {/* 4. Featured Products Grid (With Apple-style breathing room) */}
      <section className="py-24 sm:py-32 lg:py-40 bg-white">
        <div className="container-zahra">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14 sm:mb-20">
            <div>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8B1A2E] mb-3 uppercase tracking-wider">
                <Sparkles size={16} />
                <span>المنتجات الأكثر طلباً وإعجاباً</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A0C08] tracking-tight">
                مختارات راقية لبيتك
              </h2>
              <p className="text-sm sm:text-base text-[#7A645A] mt-3 max-w-xl leading-relaxed">
                أحدث موديلات البياضات والمفروشات والملابس الحريمي الأكثر مبيعاً
              </p>
            </div>
            <Link
              href="/products"
              className="btn-outline h-13 px-7 text-xs sm:text-sm font-bold flex items-center gap-2.5 self-start sm:self-auto hover:scale-102"
            >
              <span>عرض جميع المنتجات</span>
              <ArrowLeft size={16} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts.slice(0, 8)} />
        </div>
      </section>

      {/* 4. Grand Limited-Time Deals Banner */}
      <OffersBanner />

      {/* 5. Special Discounts Showcase */}
      {saleProducts.length > 0 && (
        <section className="py-24 sm:py-32 bg-[#FAF7F5] border-t border-[#EDE0D4]/70">
          <div className="container-zahra">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14 sm:mb-20">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DC2626] mb-3 uppercase tracking-wider">
                  <Flame size={16} />
                  <span>تخفيضات كبرى لفترة محدودة</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A0C08] tracking-tight">
                  أحدث العروض والخصومات
                </h2>
                <p className="text-sm sm:text-base text-[#7A645A] mt-3 max-w-xl leading-relaxed">
                  اغتنمي الفرصة وتسوقي منتجاتك المفضلة بأسعار مخفضة
                </p>
              </div>
              <Link
                href="/offers"
                className="btn-primary h-13 px-8 text-xs sm:text-sm font-bold flex items-center gap-2.5 self-start sm:self-auto shadow-md"
              >
                <span>جميع العروض <span className="tabular-nums font-black">({saleProducts.length})</span></span>
                <ArrowLeft size={16} />
              </Link>
            </div>

            <ProductGrid products={saleProducts.slice(0, 4)} />
          </div>
        </section>
      )}

      {/* 6. Why Shop With Us (Trust & Reliability) */}
      <WhyUsSection />

      {/* 7. Social Proof & Customer Reviews */}
      <SocialProofSection />
    </div>
  );
}
