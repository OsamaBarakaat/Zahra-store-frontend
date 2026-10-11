"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useToastStore } from "@/lib/stores/toastStore";
import ProductGallery from "@/components/product/ProductGallery";
import StickyAddToCart from "@/components/product/StickyAddToCart";
import ProductGrid from "@/components/product/ProductGrid";
import Badge from "@/components/ui/Badge";
import {
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronLeft,
  Share2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const toast = useToastStore();

  const isLiked = isInWishlist(product.id);

  // Variations state
  const colors = product.variants.filter((v) => v.type === "color");
  const sizes = product.variants.filter((v) => v.type === "size");

  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    sizes[0]?.name || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (openDrawer = true) => {
    if (!product.inStock) return;

    setIsAdding(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0]?.url || "/logo.png",
      quantity,
      selectedVariants: {
        ...(selectedColor ? { اللون: selectedColor } : {}),
        ...(selectedSize ? { المقاس: selectedSize } : {}),
      },
    });

    toast.success(`تمت إضافة "${product.name}" إلى السلة 🛍️`);

    setTimeout(() => {
      setIsAdding(false);
      if (openDrawer) {
        openCart();
      }
    }, 300);
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
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
      toast.info(`تمت إضافة المنتج إلى المفضلة ❤️`);
    } else {
      toast.info(`تم الحذف من المفضلة`);
    }
  };

  return (
    <div className="container-zahra py-10 sm:py-16 lg:py-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs sm:text-sm text-[#7A645A] mb-8">
        <Link href="/" className="hover:text-[#8B1A2E] font-medium">الرئيسية</Link>
        <ChevronLeft size={14} />
        <Link href="/products" className="hover:text-[#8B1A2E] font-medium">المنتجات</Link>
        <ChevronLeft size={14} />
        <Link href={`/categories/${product.category}`} className="hover:text-[#8B1A2E] font-medium">{product.categoryName}</Link>
        <ChevronLeft size={14} />
        <span className="text-[#1A0C08] font-bold truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout with generous Apple-style gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-20 lg:mb-28 items-start">
        {/* Left/Start Column: Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right/End Column: Info & Actions */}
        <div className="flex flex-col gap-6">
          {/* Category & Title */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs sm:text-sm font-bold text-[#8B1A2E] bg-[#FDF8F5] px-3.5 py-1 rounded-full border border-[#EDE0D4]">
                {product.categoryName}
              </span>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                aria-label="إضافة للمفضلة"
                className="w-11 h-11 rounded-full border border-[#EDE0D4] bg-white flex items-center justify-center text-stone-600 hover:text-[#8B1A2E] active:scale-95 transition-all shadow-xs"
              >
                <Heart size={20} className={isLiked ? "fill-[#8B1A2E] text-[#8B1A2E]" : ""} />
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A0C08] leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "fill-amber-400" : "text-stone-300"}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1A0C08]">{product.rating}</span>
              <span className="text-xs text-[#9E8075]">({product.reviewCount} تقييم حقيقي)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#FDF8F5] border border-[#EDE0D4] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#8B1A2E]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm sm:text-base text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9E8075] mt-0.5">
                شامل ضريبة المبيعات • الدفع عند الاستلام متاح
              </p>
            </div>

            {product.discount && (
              <Badge variant="sale" className="text-sm px-3 py-1">
                خصم {product.discount}%
              </Badge>
            )}
          </div>

          {/* Color Variation Selector */}
          {colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#5C4A42]">اللون المختار:</span>
                <span className="text-xs font-extrabold text-[#8B1A2E]">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      selectedColor === c.name
                        ? "border-[#8B1A2E] bg-white text-[#8B1A2E] shadow-xs"
                        : "border-[#EDE0D4] bg-stone-50 text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: c.value }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variation Selector */}
          {sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#5C4A42]">المقاس المختار:</span>
                <span className="text-xs font-extrabold text-[#8B1A2E]">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSize(s.name)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                      selectedSize === s.name
                        ? "border-[#8B1A2E] bg-[#8B1A2E] text-white shadow-xs"
                        : "border-[#EDE0D4] bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <span className="text-xs font-bold text-[#5C4A42] block mb-2">الكمية:</span>
            <div className="inline-flex items-center bg-white border border-[#EDE0D4] rounded-2xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 font-black text-lg"
                aria-label="تقليل الكمية"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-extrabold text-[#1A0C08]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 font-black text-lg"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs (Add to Cart & Buy Now) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleAddToCart(true)}
              disabled={!product.inStock || isAdding}
              className="btn-primary flex-1 h-13 text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
              style={{ minHeight: 50 }}
            >
              {isAdding ? (
                <Check size={20} />
              ) : (
                <>
                  <ShoppingBag size={20} />
                  <span>أضيفي للسلة</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="h-13 px-7 rounded-full bg-[#1A0C08] text-white hover:bg-[#382018] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{ minHeight: 50 }}
            >
              <Zap size={18} className="text-[#E8A4A0]" />
              <span>اشتري الآن مباشرة</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#EDE0D4] text-center">
            <div className="p-3 rounded-xl bg-white border border-[#EDE0D4] flex flex-col items-center gap-1">
              <ShieldCheck size={20} className="text-[#8B1A2E]" />
              <span className="text-[11px] font-bold text-[#1A0C08]">معاينة قبل الدفع</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#EDE0D4] flex flex-col items-center gap-1">
              <Truck size={20} className="text-[#8B1A2E]" />
              <span className="text-[11px] font-bold text-[#1A0C08]">شحن لكل مصر</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#EDE0D4] flex flex-col items-center gap-1">
              <RotateCcw size={20} className="text-[#8B1A2E]" />
              <span className="text-[11px] font-bold text-[#1A0C08]">استبدال سهل</span>
            </div>
          </div>

          {/* Description & Specs */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-[#1A0C08] mb-2">وصف المنتج وتفاصيله:</h3>
            <p className="text-xs sm:text-sm text-[#5C4A42] leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-[#EDE0D4]">
              {product.description}
            </p>

            {product.material && (
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#8B1A2E]">
                <span>الخامة:</span>
                <span className="text-[#1A0C08]">{product.material}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-[#EDE0D4]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#1A0C08]">
              منتجات قد تعجبكِ أيضاً
            </h2>
            <Link href={`/categories/${product.category}`} className="text-xs sm:text-sm font-bold text-[#8B1A2E] hover:underline">
              المزيد من {product.categoryName}
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <StickyAddToCart
        name={product.name}
        price={product.price}
        image={product.images[0]?.url || "/logo.png"}
        onAddToCart={() => handleAddToCart(true)}
        inStock={product.inStock}
      />
    </div>
  );
}
