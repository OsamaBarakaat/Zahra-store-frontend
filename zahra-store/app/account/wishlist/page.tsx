"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { formatPrice } from "@/lib/utils/format";
import { Heart, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toast = useToastStore();

  const handleAddToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
      selectedVariants: { اللون: "الأساسي", المقاس: "قياسي" },
    });
    toast.success(`تمت إضافة "${item.name}" إلى السلة 🛍️`);
    openCart();
  };

  if (items.length === 0) {
    return (
      <div className="container-zahra py-16 text-center max-w-md mx-auto">
        <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4]">
          <div className="w-16 h-16 rounded-full bg-[#FDF8F5] border border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h1 className="text-xl font-black text-[#1A0C08] mb-2">
            قائمة المفضلة فارغة ❤️
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8075] mb-6">
            يمكنكِ حفظ أي منتج يعجبكِ أثناء التصفح للرجوع إليه وشرائه في أي وقت.
          </p>
          <Link href="/products" className="btn-primary w-full h-11 text-sm font-bold flex items-center justify-center gap-2">
            <span>تصفحي المنتجات</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-zahra py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE0D4]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08]">
            المنتجات المفضلة ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8075] mt-1">
            جميع المنتجات المحفوظة في قائمتكِ
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          مسح الكل
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="p-3 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
                <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" />
                <button
                  onClick={() => removeItem(item.productId)}
                  aria-label="حذف من المفضلة"
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-stone-600 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <Link
                href={`/products/${item.slug}`}
                className="text-xs sm:text-sm font-bold text-[#1A0C08] line-clamp-2 hover:text-[#8B1A2E]"
              >
                {item.name}
              </Link>
            </div>

            <div className="pt-3 mt-3 border-t border-[#F5EDE6] flex items-center justify-between gap-2">
              <span className="text-sm font-black text-[#8B1A2E]">
                {formatPrice(item.price)}
              </span>
              <button
                onClick={() => handleAddToCart(item)}
                className="btn-primary h-9 px-3 text-xs font-bold flex items-center gap-1"
              >
                <ShoppingBag size={14} />
                <span>أضيفي</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
