"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useToastStore } from "@/lib/stores/toastStore";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const toast = useToastStore();

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0]?.url || "/logo.png",
      quantity: 1,
      selectedVariants: {
        اللون: product.variants.find((v) => v.type === "color")?.name || "الأساسي",
        المقاس: product.variants.find((v) => v.type === "size")?.name || "قياسي",
      },
    });

    toast.success(`تمت إضافة "${product.name}" إلى السلة 🛍️`);

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 380);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0]?.url || "/logo.png",
      addedAt: new Date().toISOString(),
    });

    if (!isLiked) {
      toast.info(`تمت إضافة "${product.name}" إلى المفضلة ❤️`);
    } else {
      toast.info(`تم حذف "${product.name}" من المفضلة`);
    }
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-[24px] sm:rounded-[28px] border border-[#EDE0D4] hover:border-[#8B1A2E]/40 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      {/* Product Image Frame */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-stone-50"
      >
        <Image
          src={product.images[0]?.url || "/logo.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
        />

        {/* Badges on top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {product.discount && (
            <Badge variant="sale" className="shadow-sm">
              خصم {product.discount}%
            </Badge>
          )}
          {product.isNew && !product.discount && (
            <Badge variant="new" className="shadow-sm">جديد</Badge>
          )}
          {!product.inStock && (
            <Badge variant="out">نفد من المخزون</Badge>
          )}
        </div>

        {/* Wishlist Button on top left */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isLiked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105 active:scale-90 z-10"
        >
          <Heart
            size={18}
            className={isLiked ? "fill-[#8B1A2E] text-[#8B1A2E]" : "text-stone-600 hover:text-[#8B1A2E]"}
          />
        </button>

        {/* Available Color Dots */}
        {product.variants.filter((v) => v.type === "color").length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-stone-200/50">
            {product.variants
              .filter((v) => v.type === "color")
              .slice(0, 4)
              .map((color) => (
                <span
                  key={color.id}
                  className="w-2.5 h-2.5 rounded-full border border-stone-300"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
          </div>
        )}
      </Link>

      {/* Info & Pricing Container with generous internal padding */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#8B1A2E] block mb-1">
            {product.categoryName}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm sm:text-base font-bold text-[#1A0C08] line-clamp-2 leading-snug hover:text-[#8B1A2E] transition-colors"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-[#F5EDE6] flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-[#8B1A2E]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quick Add Button — Icon only with luxury Apple-like circular styling */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock || isAdding}
            title={product.inStock ? "أضيفي إلى السلة" : "نفد من المخزون"}
            aria-label={`إضافة ${product.name} للسلة`}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 ${
              isAdding
                ? "bg-emerald-600 text-white scale-105 shadow-md shadow-emerald-600/30"
                : "bg-[#FAF7F5] text-[#8B1A2E] border border-[#EDE0D4] hover:bg-[#8B1A2E] hover:text-white hover:border-[#8B1A2E] hover:shadow-md hover:scale-105"
            }`}
          >
            {isAdding ? (
              <Check size={18} className="animate-in zoom-in" />
            ) : (
              <ShoppingBag size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
