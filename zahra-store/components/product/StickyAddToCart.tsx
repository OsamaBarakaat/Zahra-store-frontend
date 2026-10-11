"use client";
import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

interface StickyAddToCartProps {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
  inStock: boolean;
}

export default function StickyAddToCart({
  name,
  price,
  image,
  onAddToCart,
  inStock,
}: StickyAddToCartProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE0D4] p-3 shadow-lg">
      <div className="container-zahra flex items-center justify-between gap-3">
        {/* Product preview */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
            <Image src={image} alt={name} fill sizes="44px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1A0C08] truncate max-w-[130px] xs:max-w-[180px]">
              {name}
            </p>
            <p className="text-sm font-extrabold text-[#8B1A2E]">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onAddToCart}
          disabled={!inStock}
          className="btn-primary flex-1 max-w-[170px] h-11 text-sm font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          style={{ minHeight: 44 }}
        >
          <ShoppingBag size={16} />
          <span>{inStock ? "أضيفي للسلة" : "نفد من المخزون"}</span>
        </button>
      </div>
    </div>
  );
}
