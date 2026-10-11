import React from "react";
import { ProductService } from "@/lib/services/api";
import ProductGrid from "@/components/product/ProductGrid";
import OffersBanner from "@/components/home/OffersBanner";
import { Tag, Sparkles } from "lucide-react";

export const metadata = {
  title: "العروض والخصومات | زهره ستور",
  description: "أقوى التخفيضات والعروض الحصرية على المفروشات المنزلية، البياضات، الإسدالات، والطرح والبيجامات من زهره ستور.",
};

export default async function OffersPage() {
  const saleProducts = await ProductService.getSale();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Offers Top Announcement */}
      <OffersBanner />

      <div className="container-zahra py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE0D4]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] mb-1">
              <Tag size={14} />
              <span>وفرّي أكثر مع زهره</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08]">
              جميع العروض المخفضة حالياً 🔥
            </h1>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#8B1A2E] bg-[#FDF8F5] px-3.5 py-1.5 rounded-full border border-[#EDE0D4]">
            {saleProducts.length} عرض متوفر
          </span>
        </div>

        <ProductGrid
          products={saleProducts}
          emptyMessage="ترقبي عروضنا الجديدة قريباً جداً!"
        />
      </div>
    </div>
  );
}
