import React from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = "لا توجد منتجات متوفرة حالياً في هذا القسم",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-[#EDE0D4] p-8">
        <p className="text-lg font-bold text-[#5C4A42] mb-2">{emptyMessage}</p>
        <p className="text-sm text-[#9E8075]">تفقدي أقسامنا الأخرى لاكتشاف أجمل المنتجات والعروض</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
