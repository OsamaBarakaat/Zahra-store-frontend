"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatPrice } from "@/lib/utils/format";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
} from "lucide-react";
import { useToastStore } from "@/lib/stores/toastStore";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } =
    useCartStore();
  const toast = useToastStore();

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ZAHRA10" || code === "زهره10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon(code);
      toast.success("تم تطبيق كود الخصم 10% بنجاح! 🎉");
    } else if (code === "FREE" || code === "مجانا") {
      setDiscountAmount(50);
      setAppliedCoupon(code);
      toast.success("تم تطبيق خصم الشحن بقيمة 50 جنيه! 🎉");
    } else {
      toast.error("كود الخصم غير صحيح أو منتهي الصلاحية");
    }
  };

  const total = Math.max(0, subtotal - discountAmount);

  if (items.length === 0) {
    return (
      <div className="container-zahra py-16 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#FDF8F5] border-2 border-dashed border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] mx-auto mb-5">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#1A0C08] mb-2">
            سلة التسوق فارغة
          </h1>
          <p className="text-sm text-[#9E8075] mb-6">
            يبدو أنكِ لم تضيفي أي منتجات للسلة بعد. استكشفي أحدث تشكيلاتنا
            واختاري ما يسعدكِ.
          </p>
          <Link
            href="/products"
            className="btn-primary w-full h-12 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ابدأي التسوق الآن</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-zahra py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE0D4]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08]">
          سلة المشتريات{" "}
          <span className="tabular-nums font-bold text-lg text-[#8B1A2E]">
            ({itemCount} منتج)
          </span>
        </h1>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-[#8B1A2E] hover:underline flex items-center gap-1"
        >
          <span>متابعة التسوق</span>
          <ArrowLeft size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => {
            const variantDetails = Object.entries(item.selectedVariants || {})
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | ");

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product image & details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
                    <Image
                      src={item.image || "/logo/zahra-logoo.png"}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm sm:text-base font-bold text-[#1A0C08] hover:text-[#8B1A2E] line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    {variantDetails && (
                      <p className="text-xs text-[#9E8075] mt-1">
                        {variantDetails}
                      </p>
                    )}

                    {item.customChairImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#EDE0D4] bg-stone-100 flex-shrink-0">
                          <Image
                            src={item.customChairImage}
                            alt="صورة كرسي العميل"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#8B1A2E] bg-[#FDF8F5] px-2 py-0.5 rounded-full border border-[#EDE0D4]">
                          📸 صورة كرسي العميل مرفقة للتفصيل
                        </span>
                      </div>
                    )}

                    <div className="text-xs sm:text-sm font-extrabold text-[#8B1A2E] mt-2">
                      سعر القطعة: {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                {/* Counter & Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#F5EDE6]">
                  {/* Quantity Control */}
                  <div className="inline-flex items-center bg-[#FDF8F5] border border-[#EDE0D4] rounded-full p-1 gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="تقليل الكمية"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:bg-white text-base font-black"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-[#1A0C08]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="زيادة الكمية"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:bg-white text-base font-black"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Total for item */}
                  <div className="text-left">
                    <span className="text-base font-black text-[#1A0C08] block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`حذف ${item.name}`}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white border border-[#EDE0D4] shadow-sm sticky top-24">
          <h2 className="text-lg font-black text-[#1A0C08] pb-3 mb-4 border-b border-[#EDE0D4]">
            ملخص الطلب
          </h2>

          {/* Pricing Breakdown */}
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-[#5C4A42]">
              <span>المجموع الفرعي ({itemCount} قطع)</span>
              <span className="font-bold text-[#1A0C08]">
                {formatPrice(subtotal)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>الخصم المطبق ({appliedCoupon})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#5C4A42]">
              <span>مصاريف الشحن</span>
              <span className="text-xs text-[#8B1A2E] font-bold">
                تُحدد في خطوة الدفع حسب المحافظة
              </span>
            </div>

            <div className="pt-3 border-t border-[#EDE0D4] flex justify-between items-baseline">
              <span className="font-bold text-base text-[#1A0C08]">
                الإجمالي التقريبي
              </span>
              <span className="text-2xl font-black text-[#8B1A2E]">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="mb-6">
            <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
              هل لديكِ كود خصم؟
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="كود الخصم (جربي ZAHRA10)"
                className="input-field text-xs uppercase"
                style={{ minHeight: 42, padding: "8px 12px" }}
              />
              <button
                type="submit"
                className="btn-outline h-10 px-4 text-xs font-bold flex-shrink-0"
                style={{ minHeight: 42 }}
              >
                تطبيق
              </button>
            </div>
          </form>

          {/* Primary Checkout CTA */}
          <button
            onClick={() => router.push("/checkout")}
            className="btn-primary w-full h-13 text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#8B1A2E]/20 active:scale-95 mb-4"
            style={{ minHeight: 52 }}
          >
            <span>متابعة إتمام الطلب</span>
            <ArrowLeft size={18} />
          </button>

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-2xl bg-[#FDF8F5] border border-[#EDE0D4] text-xs text-[#5C4A42] flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-[#8B1A2E] flex-shrink-0" />
            <span>
              الدفع عند الاستلام متاح بعد المعاينة، أو عبر إنستاباي وفودافون
              كاش.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
