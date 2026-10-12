"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const patterns = product.variants.filter((v) => v.type === "pattern");
  const coverTypes = product.variants.filter((v) => v.type === "cover_type");

  const isChairCover =
    product.isChairCover ||
    product.slug.includes("chair-cover") ||
    product.name.includes("تلبيسة");

  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0]?.name || "وردي غامق"
  );
  const [selectedPattern, setSelectedPattern] = useState<string>(
    patterns[0]?.name || "مربعات وجواها زهور"
  );
  const [selectedCoverType, setSelectedCoverType] = useState<string>(
    coverTypes[0]?.name || "عادي (للكرسي الخشبي القياسي)"
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    sizes[0]?.name || ""
  );
  const [customChairImage, setCustomChairImage] = useState<string | null>(null);
  const [chairImageError, setChairImageError] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Price calculation based on custom cover (+200 EGP)
  const isCustom = selectedCoverType.includes("عمولة");
  const priceModifier = isCustom ? 200 : 0;
  const currentPrice = product.price + priceModifier;
  const currentOriginalPrice = product.originalPrice
    ? product.originalPrice + priceModifier
    : undefined;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("من فضلك اختاري ملف صورة صالح");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomChairImage(result);
      setChairImageError(false);
      toast.success("تم إرفاق صورة الكرسي بنجاح 📸");
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = (openDrawer = true) => {
    if (!product.inStock) return;

    // Validation for custom chair cover photo
    if (isChairCover && isCustom && !customChairImage) {
      setChairImageError(true);
      toast.error("يرجى تصوير كرسيك أو رفع صورته لتأكيد طلب التفصيل العمولة 📸");
      const uploadElement = document.getElementById("chair-photo-upload-section");
      uploadElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsAdding(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: product.images[0]?.url || "/logo/zahra-logo.png",
      quantity,
      selectedVariants: {
        ...(selectedColor ? { "لون القماش": selectedColor } : {}),
        ...(patterns.length > 0 ? { "شكل النقشة": selectedPattern } : {}),
        ...(coverTypes.length > 0
          ? {
              "نوع التلبيسة": isCustom
                ? "عمولة على مقاس الكرسي (+200 جنيه)"
                : "عادي (للكرسي الخشبي القياسي)",
            }
          : {}),
        ...(isChairCover ? { "محتويات الطقم": `طقم سفرة كامل (${quantity * 6} تلبيسات كراسي)` } : {}),
        ...(selectedSize && sizes.length > 0 ? { المقاس: selectedSize } : {}),
      },
      customChairImage: isCustom && customChairImage ? customChairImage : undefined,
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
    if (isChairCover && isCustom && !customChairImage) {
      setChairImageError(true);
      toast.error("يرجى تصوير كرسيك أو رفع صورته لتأكيد طلب التفصيل العمولة 📸");
      const uploadElement = document.getElementById("chair-photo-upload-section");
      uploadElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    handleAddToCart(false);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: product.images[0]?.url || "/logo/zahra-logo.png",
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

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-20 lg:mb-28 items-start">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Info & Options */}
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

          {/* Pricing Box (Dynamically updates when custom +200 is selected) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FDF8F5] border border-[#EDE0D4] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#8B1A2E]">
                  {formatPrice(currentPrice)}
                </span>
                {currentOriginalPrice && (
                  <span className="text-sm sm:text-base text-stone-400 line-through">
                    {formatPrice(currentOriginalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9E8075] mt-0.5">
                {isChairCover
                  ? isCustom
                    ? "السعر يشمل طقم كامل 6 كراسي (150) + 200 جنيه تفصيل عمولة مخصوص للطقم"
                    : "السعر لطقم سفرة كامل مكون من 6 تلبيسات كراسي"
                  : isCustom
                  ? "السعر العادي (150) + 200 جنيه تفصيل عمولة مخصوص"
                  : "شامل ضريبة المبيعات • الدفع عند الاستلام متاح"}
              </p>
            </div>

            {isCustom ? (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#8B1A2E] text-white">
                تفصيل عمولة
              </span>
            ) : product.discount ? (
              <Badge variant="sale" className="text-sm px-3 py-1">
                خصم {product.discount}%
              </Badge>
            ) : null}
          </div>

          {/* Chair Cover Set Notice (6 Chairs per set) */}
          {isChairCover && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FDF8F5] via-[#FFF] to-[#F2D4CC]/40 border-2 border-[#E8A4A0] flex items-center gap-3.5 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-[#8B1A2E] text-white flex flex-col items-center justify-center font-black flex-shrink-0 shadow-xs">
                <span className="text-base leading-none">6</span>
                <span className="text-[9px] leading-tight font-medium opacity-90">كراسي</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#1A0C08]">
                    الطقم يباع على بعضه 6 تلبيسات كاملة
                  </span>
                  <span className="text-[10px] font-black text-[#8B1A2E] bg-white px-2 py-0.5 rounded-full border border-[#EDE0D4]">
                    طقم سفرة 6 كراسي
                  </span>
                </div>
                <p className="text-xs text-[#5C4A42] leading-relaxed">
                  الطلب الواحد يشمل <strong>طقم متكامل مكون من 6 تلبيسات كراسي</strong> تكفي طقم سفرة 6 كراسي بالكامل.
                </p>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              CHAIR COVER SPECIALIZED 3-STEP CUSTOMIZATION FLOW
             ═════════════════════════════════════════════════════════════════════ */}
          {isChairCover ? (
            <div className="space-y-6 pt-2">
              {/* Step 1: Color Selection (10 Colors) */}
              <div className="p-5 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8B1A2E] text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-sm font-black text-[#1A0C08]">
                      الخطوة الأولى: اختاري لون القماش
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold text-[#8B1A2E] bg-[#FDF8F5] px-2.5 py-0.5 rounded-full border border-[#EDE0D4]">
                    {selectedColor}
                  </span>
                </div>
                <p className="text-xs text-[#7A645A] mb-3">
                  متوفر بـ 10 ألوان غنية تناسب ديكور وفرش بيتك:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-200 text-right ${
                          isSelected
                            ? "border-[#8B1A2E] bg-[#FDF8F5] shadow-xs scale-102"
                            : "border-[#EDE0D4] bg-white hover:border-stone-300"
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/15 shadow-2xs flex-shrink-0"
                          style={{ backgroundColor: c.value }}
                        />
                        <span className={`text-xs font-bold truncate ${isSelected ? "text-[#8B1A2E]" : "text-[#1A0C08]"}`}>
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Pattern Selection */}
              {patterns.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#8B1A2E] text-white text-xs font-black flex items-center justify-center">
                        2
                      </span>
                      <h3 className="text-sm font-black text-[#1A0C08]">
                        الخطوة الثانية: اختاري شكل النقشة
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold text-[#8B1A2E] bg-[#FDF8F5] px-2.5 py-0.5 rounded-full border border-[#EDE0D4]">
                      {selectedPattern}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {patterns.map((pat) => {
                      const isSelected = selectedPattern === pat.name;
                      return (
                        <button
                          key={pat.id}
                          type="button"
                          onClick={() => setSelectedPattern(pat.name)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-right ${
                            isSelected
                              ? "border-[#8B1A2E] bg-[#FDF8F5] shadow-xs"
                              : "border-[#EDE0D4] bg-white hover:border-stone-300"
                          }`}
                        >
                          {pat.image && (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-stone-200">
                              <Image
                                src={pat.image}
                                alt={pat.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs sm:text-sm font-black block mb-0.5 ${isSelected ? "text-[#8B1A2E]" : "text-[#1A0C08]"}`}>
                              {pat.name}
                            </span>
                            <span className="text-[11px] text-[#7A645A] block">
                              {pat.name.includes("مربعات")
                                ? "نقشة هندسية راقية بخلفية مربعات بارزة"
                                : "نقشة نباتية ناعمة بشكل أوراق وزهور دائرية"}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#8B1A2E] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Cover Type Selection (Standard vs Custom +200) */}
              {coverTypes.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#8B1A2E] text-white text-xs font-black flex items-center justify-center">
                        3
                      </span>
                      <h3 className="text-sm font-black text-[#1A0C08]">
                        الخطوة الثالثة: نوع التلبيسة
                      </h3>
                    </div>
                    {isCustom && (
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        +200 جنيه عمولة
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {coverTypes.map((t) => {
                      const isSelected = selectedCoverType === t.name;
                      const isCustomOption = t.name.includes("عمولة");
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedCoverType(t.name)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#8B1A2E] bg-[#FDF8F5] shadow-xs"
                              : "border-[#EDE0D4] bg-white hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="cover_type"
                                checked={isSelected}
                                onChange={() => setSelectedCoverType(t.name)}
                                className="w-4 h-4 accent-[#8B1A2E]"
                              />
                              <div>
                                <span className={`text-sm font-black block ${isSelected ? "text-[#8B1A2E]" : "text-[#1A0C08]"}`}>
                                  {isCustomOption ? "تفصيل عمولة مخصوص (طقم 6 كراسي حسب مقاس كراسيك)" : "مقاس عادي standard (طقم 6 كراسي خشبية قياسية)"}
                                </span>
                                <span className="text-xs text-[#7A645A] mt-0.5 block">
                                  {isCustomOption
                                    ? "طقم كامل مكون من 6 تلبيسات تفصيل يدوي بالمللي على شكل ومقاس كراسيك (+200 جنيه للطقم بالكامل)"
                                    : "طقم كامل مكون من 6 تلبيسات بمقاس قياسي يناسب كراسي السفرة الخشبية المعتادة"}
                                </span>
                              </div>
                            </label>

                            <span className="text-xs sm:text-sm font-black flex-shrink-0 text-[#8B1A2E]">
                              {isCustomOption ? "+200 جنيه" : "السعر الأساسي"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 📸 MANDATORY PHOTO UPLOAD SECTION FOR CUSTOM COVERS */}
              {isCustom && (
                <div
                  id="chair-photo-upload-section"
                  className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                    chairImageError
                      ? "border-red-500 bg-red-50/40 shadow-md ring-2 ring-red-400"
                      : "border-amber-400/80 bg-amber-50/30 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      📸
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-[#1A0C08]">
                        تصوير الكرسي مطلوب للتفصيل العمولة (+200 جنيه)
                      </h4>
                      <p className="text-xs text-[#5C4A42] mt-1 leading-relaxed">
                        علشان نعملك التلبيسة عمولة مظبوطة بالمللي على كرسيك، صوّري الكرسي صورة واضحة من الأمام والجنب. سيتواصل معكِ فريقنا بعد تأكيد الطلب لتأكيد المقاسات قبل البدء في التفصيل.
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {customChairImage ? (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                          <Image
                            src={customChairImage}
                            alt="صورة الكرسي المرفقة"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block w-fit mb-1">
                            ✓ تم إرفاق صورة الكرسي بنجاح
                          </span>
                          <span className="text-[11px] text-[#9E8075]">
                            جاهز لإرسالها مع الطلب
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-outline h-9 px-3 text-xs font-bold"
                        >
                          تغيير الصورة
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomChairImage(null)}
                          className="w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center text-xs font-bold"
                          title="حذف الصورة"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full mt-2 p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        chairImageError
                          ? "border-red-400 bg-red-50 hover:bg-red-100/60"
                          : "border-amber-400/90 bg-white hover:bg-amber-50/50"
                      }`}
                    >
                      <span className="text-2xl">📷</span>
                      <span className="text-xs sm:text-sm font-bold text-[#1A0C08]">
                        اضغطي هنا لالتقاط صورة للكرسي بالكاميرا أو رفعها من المعرض
                      </span>
                      <span className="text-[11px] text-[#7A645A]">
                        (الصيغ المدعومة: JPG، PNG، WEBP)
                      </span>
                    </button>
                  )}

                  {chairImageError && (
                    <p className="text-xs font-bold text-red-600 mt-2">
                      ⚠️ يجب تصوير الكرسي أو إرفاق صورته قبل إضافة المنتج للسلة عند اختيار تفصيل عمولة!
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Standard Product Options (Colors & Sizes) */
            <>
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
            </>
          )}

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#5C4A42]">
                {isChairCover ? "الكمية (عدد أطقم السفرة):" : "الكمية:"}
              </span>
              {isChairCover && (
                <span className="text-xs font-black text-[#8B1A2E] bg-[#FDF8F5] px-2.5 py-0.5 rounded-full border border-[#EDE0D4]">
                  {quantity === 1 ? "طقم واحد = 6 تلبيسات كراسي سفرة" : `${quantity} أطقم = ${quantity * 6} تلبيسة كراسي سفرة`}
                </span>
              )}
            </div>

            <div className="inline-flex items-center bg-white border border-[#EDE0D4] rounded-2xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 font-black text-lg"
                aria-label="تقليل الكمية"
              >
                -
              </button>
              <span className="w-24 text-center text-sm font-extrabold text-[#1A0C08]">
                {isChairCover ? `${quantity} طقم (${quantity * 6} كراسي)` : quantity}
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

            {isChairCover && (
              <p className="text-[11px] text-[#7A645A] mt-2 leading-relaxed">
                💡 <strong>توضيح مهم:</strong> الطقم يباع على بعضه 6 تلبيسات لطقم سفرة 6 كراسي كاملة. لو سفرتك 6 كراسي اختاري <strong>1 طقم</strong>، ولو 12 كرسي اختاري <strong>2 طقم</strong>.
              </p>
            )}
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
        price={currentPrice}
        image={product.images[0]?.url || "/logo/zahra-logo.png"}
        onAddToCart={() => handleAddToCart(true)}
        inStock={product.inStock}
      />
    </div>
  );
}
