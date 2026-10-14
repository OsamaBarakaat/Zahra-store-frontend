"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToastStore } from "@/lib/stores/toastStore";
import { formatPrice } from "@/lib/utils/format";
import { isValidEgyptianPhone, validateCheckoutForm } from "@/lib/utils/validation";
import { EGYPTIAN_GOVERNORATES, PaymentMethod } from "@/lib/types";
import { OrderService, ShippingService, ShippingZone } from "@/lib/services/api";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Tag,
  CreditCard,
  Phone,
  HelpCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();
  const toast = useToastStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  // Mobile Order Summary toggle
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    contact: "",
    newsletter: true,
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    governorate: "القاهرة",
    postalCode: "",
    phone: "",
    saveInfo: true,
    sameBilling: true,
    differentBillingAddress: "",
    orderNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentReference, setPaymentReference] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);

  // Fetch real shipping rates from Supabase
  React.useEffect(() => {
    ShippingService.getZones().then((zones) => {
      if (zones && zones.length > 0) {
        setShippingZones(zones);
      }
    });
  }, []);

  // Dynamic Shipping Calculation by Egyptian Governorate (Live API + Fallback)
  const baseShippingCost = useMemo(() => {
    const gov = formData.governorate;
    const match = shippingZones.find((z) => z.governorate_name_ar === gov && z.is_active);
    if (match) return match.shipping_fee;

    if (gov === "القاهرة" || gov === "الجيزة") return 65;
    if (["الإسكندرية", "القليوبية", "الغربية", "المنوفية", "الدقهلية", "الشرقية", "كفر الشيخ", "البحيرة", "دمياط"].includes(gov)) {
      return 75;
    }
    if (["بورسعيد", "الإسماعيلية", "السويس", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان"].includes(gov)) {
      return 85;
    }
    // Frontier governorates
    return 110;
  }, [formData.governorate, shippingZones]);

  // Apply 50% discount on shipping if InstaPay is selected (as seen in the reference image)
  const shippingCost = useMemo(() => {
    if (paymentMethod === "instapay") {
      return Math.round(baseShippingCost * 0.5);
    }
    return baseShippingCost;
  }, [baseShippingCost, paymentMethod]);

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ZAHRA10" || code === "زهره10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setAppliedCoupon(code);
      toast.success("تم تفعيل كود الخصم 10% بنجاح");
    } else if (code === "FREE" || code === "مجانا") {
      setDiscountAmount(shippingCost);
      setAppliedCoupon(code);
      toast.success("تم تطبيق شحن مجاني بنجاح");
    } else {
      toast.error("كود الخصم غير صحيح أو منتهي الصلاحية");
    }
  };

  const copyToClipboard = (text: string, type: "insta" | "voda") => {
    navigator.clipboard?.writeText(text);
    if (type === "insta") {
      setCopiedInsta(true);
      setTimeout(() => setCopiedInsta(false), 2000);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 2000);
    }
    toast.info("تم نسخ الرقم إلى الحافظة 📋");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("سلة التسوق فارغة!");
      router.push("/products");
      return;
    }

    // Validate
    const formErrors = validateCheckoutForm({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || formData.contact,
      governorate: formData.governorate,
      city: formData.city,
      street: formData.address,
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // scroll to first error
      toast.error("من فضلك استكملي البيانات المطلوبة باللون الأحمر");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await OrderService.createOrder({
        items,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || formData.contact,
          email: formData.contact.includes("@") ? formData.contact : undefined,
        },
        address: {
          governorate: formData.governorate,
          city: formData.city,
          street: formData.address,
          apartment: formData.apartment || undefined,
          notes: formData.orderNotes || undefined,
        },
        paymentMethod,
        paymentReference: paymentReference || undefined,
        subtotal,
        shippingCost,
        discount: discountAmount,
        total: grandTotal,
      });

      clearCart();
      toast.success("تم استلام طلبك بنجاح! ❤️");
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-zahra py-16 text-center">
        <h1 className="text-xl font-bold mb-4">لا توجد منتجات لإتمام الطلب</h1>
        <Link href="/products" className="btn-primary">العودة للتسوق</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-10 sm:py-16">
      {/* Checkout Minimal Top Header */}
      <div className="container-zahra max-w-5xl mb-8 sm:mb-12">
        <div className="flex items-center justify-between pb-5 border-b border-[#EDE0D4]">
          <Link href="/" className="relative w-28 h-12 sm:w-32 sm:h-14">
            <Image src="/logo/zahra-logo.png" alt="زهره ستور" fill className="object-contain object-right" priority />
          </Link>
          <Link href="/cart" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8B1A2E] hover:underline">
            <ShoppingBag size={18} />
            <span>العودة لسلة التسوق</span>
          </Link>
        </div>
      </div>

      {/* Mobile Collapsible Order Summary Bar (Matches user reference soulia.store screen) */}
      <div className="lg:hidden container-zahra max-w-5xl mb-6">
        <button
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE0D4] flex items-center justify-between shadow-xs text-right active:scale-99 transition-all"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#8B1A2E]">
            <ShoppingBag size={18} />
            <span>ملخص الطلب ({itemCount} منتج)</span>
            {summaryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <span className="text-base sm:text-lg font-black text-[#1A0C08]">
            {formatPrice(grandTotal)}
          </span>
        </button>

        {summaryExpanded && (
          <div className="mt-3 p-5 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                  <Image src={item.image || "/logo/zahra-logo.png"} alt={item.name} fill className="object-cover" />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-[#8B1A2E] text-white text-[10px] font-bold rounded-bl-lg flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1A0C08] truncate">{item.name}</p>
                  <p className="text-[11px] text-[#9E8075]">
                    {Object.values(item.selectedVariants || {}).join(" • ")}
                  </p>
                  {item.customChairImage && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="relative w-6 h-6 rounded-md overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                        <Image src={item.customChairImage} alt="صورة الكرسي" fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-[#8B1A2E]">
                        📸 صورة الكرسي مرفقة
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-[#1A0C08]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="pt-3 text-xs sm:text-sm space-y-2 text-[#5C4A42]">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>الخصم المطبق</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>مصاريف الشحن ({formData.governorate})</span>
                <span className="font-bold">{formatPrice(shippingCost)}</span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between text-sm sm:text-base font-black text-[#1A0C08]">
                <span>الإجمالي النهائي</span>
                <span className="text-lg text-[#8B1A2E]">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Checkout Form Grid */}
      <div className="container-zahra max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Form (7 cols on desktop) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* 1. Contact Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base sm:text-lg font-black text-[#1A0C08]">
                  بيانات التواصل
                </h2>
                <span className="text-xs text-[#9E8075]">تسوق سريع بدون تسجيل حساب</span>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-[#5C4A42] block mb-2">
                  رقم الهاتف أو البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => {
                    setFormData({ ...formData, contact: e.target.value, phone: formData.phone || e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  placeholder="01012345678 أو email@example.com"
                  className={`input-field ${errors.phone ? "error" : ""}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 font-bold mt-1.5">{errors.phone}</p>
                )}
              </div>

              <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="w-4 h-4 rounded text-[#8B1A2E] accent-[#8B1A2E]"
                />
                <span className="text-xs sm:text-sm text-[#5C4A42]">
                  أرغب في استلام العروض والخصومات الحصرية عبر الواتساب والرسائل
                </span>
              </label>
            </div>

            {/* 2. Delivery Address Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-[#1A0C08] mb-5">
                عنوان التوصيل في مصر
              </h2>

              <div className="space-y-5">
                {/* Country (Fixed Egypt) */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-[#5C4A42] block mb-2">
                    الدولة / المنطقة
                  </label>
                  <input
                    type="text"
                    disabled
                    value="جمهورية مصر العربية 🇪🇬"
                    className="input-field bg-stone-100 text-stone-600 cursor-not-allowed font-semibold"
                  />
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-[#5C4A42] block mb-2">
                      الاسم الأول <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (errors.firstName) setErrors({ ...errors, firstName: "" });
                      }}
                      placeholder="مثال: ياسمين"
                      className={`input-field ${errors.firstName ? "error" : ""}`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600 font-bold mt-1.5">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-[#5C4A42] block mb-2">
                      الاسم الأخير <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (errors.lastName) setErrors({ ...errors, lastName: "" });
                      }}
                      placeholder="مثال: محمد"
                      className={`input-field ${errors.lastName ? "error" : ""}`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-600 font-bold mt-1.5">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Governorate & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        className="input-field cursor-pointer font-bold text-[#1A0C08]"
                      >
                        {EGYPTIAN_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
                      المدينة / المركز / الحي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: "" });
                      }}
                      placeholder="مثال: المعادي / الشيخ زايد / سموحة"
                      className={`input-field ${errors.city ? "error" : ""}`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-600 font-bold mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Detailed Street Address */}
                <div>
                  <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
                    العنوان بالتفصيل: الشارع ورقم العمارة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (errors.street) setErrors({ ...errors, street: "" });
                    }}
                    placeholder="اسم الشارع، رقم العمارة، علامة مميزة"
                    className={`input-field ${errors.street ? "error" : ""}`}
                  />
                  {errors.street && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{errors.street}</p>
                  )}
                </div>

                {/* Apartment & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
                      رقم الشقة / الطابق (اختياري)
                    </label>
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="مثال: شقة 4، الدور الثاني"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
                      رقم هاتف إضافي أو بديل (اختياري)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01xxxxxxxxx"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Save info checkbox */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B1A2E] accent-[#8B1A2E]"
                  />
                  <span className="text-xs text-[#5C4A42]">
                    حفظ هذه البيانات لتسوق أسرع في المرات القادمة
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Shipping Method Card (Matches reference) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-[#1A0C08] mb-4">
                طريقة التوصيل
              </h2>
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#8B1A2E] bg-[#FDF8F5] flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1A0C08]">
                    شحن وتوصيل محافظة {formData.governorate}
                  </p>
                  <p className="text-xs text-[#9E8075] mt-1 leading-relaxed">
                    يتم توفير رقم متابعة للشحنة والتواصل قبل الاستلام
                  </p>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#8B1A2E] flex-shrink-0">
                  {formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            {/* 4. Payment Methods (Full Egyptian Experience matching soulia.store) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
              <div className="mb-5">
                <h2 className="text-base sm:text-lg font-black text-[#1A0C08]">
                  طريقة الدفع
                </h2>
                <p className="text-xs text-[#9E8075] mt-1">
                  جميع المعاملات المالية مشفرة وآمنة تماماً
                </p>
              </div>

              <div className="space-y-4">
                {/* Method 1: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#8B1A2E] bg-white shadow-xs"
                      : "border-stone-200 bg-stone-50/50 hover:border-stone-300"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 accent-[#8B1A2E]"
                    />
                    <span className="text-sm sm:text-base font-bold text-[#1A0C08]">
                      الدفع عند الاستلام (Cash on Delivery) 💵
                    </span>
                  </label>

                  {paymentMethod === "cod" && (
                    <div className="mt-4 p-4 rounded-xl bg-[#FDF8F5] border border-[#EDE0D4] text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
                      <p className="font-bold text-[#8B1A2E] mb-1.5">
                        لتأكيد طلبك وتجهيزه بعناية:
                      </p>
                      <p>
                        قد تحتاج بعض الطلبات إلى دفع عربون بسيط لتأكيد الجدية وسرعة الشحن. بعد إتمام الطلب، سيتواصل معكِ فريق خدمة العملاء لتأكيد التفاصيل. يُخصم مبلغ العربون من إجمالي الطلب، ويتم دفع المبلغ المتبقي عند الاستلام والمعاينة.
                      </p>
                    </div>
                  )}
                </div>

                {/* Method 2: Vodafone Cash */}
                <div
                  onClick={() => setPaymentMethod("vodafone_cash")}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "vodafone_cash"
                      ? "border-[#8B1A2E] bg-white shadow-xs"
                      : "border-stone-200 bg-stone-50/50 hover:border-stone-300"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "vodafone_cash"}
                      onChange={() => setPaymentMethod("vodafone_cash")}
                      className="w-4 h-4 accent-[#8B1A2E]"
                    />
                    <span className="text-sm sm:text-base font-bold text-[#1A0C08]">
                      فودافون كاش (Vodafone Cash) 📱
                    </span>
                  </label>

                  {paymentMethod === "vodafone_cash" && (
                    <div className="mt-4 p-4 rounded-xl bg-[#FDF8F5] border border-[#EDE0D4] space-y-3.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="text-[#9E8075] block text-[11px]">رقم محفظة فودافون كاش:</span>
                          <span className="text-sm sm:text-base font-black text-[#8B1A2E]">01099887766</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("01099887766", "voda")}
                          className="btn-outline h-9 px-3.5 text-xs flex items-center gap-1.5"
                        >
                          {copiedVodafone ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedVodafone ? "تم النسخ" : "نسخ الرقم"}</span>
                        </button>
                      </div>

                      <p className="text-[#5C4A42] leading-relaxed">
                        حول المبلغ الإجمالي ({formatPrice(grandTotal)}) إلى الرقم أعلاه، ثم اكتبي رقم المحول أو رقم المعاملة بالأسفل:
                      </p>

                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="رقم المحفظة التي تم التحويل منها (010xxxxxxxxx)"
                        className="input-field text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Method 3: InstaPay (With 50% discount on shipping matching image) */}
                <div
                  onClick={() => setPaymentMethod("instapay")}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "instapay"
                      ? "border-[#8B1A2E] bg-white shadow-xs"
                      : "border-stone-200 bg-stone-50/50 hover:border-stone-300"
                  }`}
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "instapay"}
                        onChange={() => setPaymentMethod("instapay")}
                        className="w-4 h-4 accent-[#8B1A2E]"
                      />
                      <span className="text-sm sm:text-base font-bold text-[#1A0C08]">
                        الدفع عبر إنستاباي (InstaPay)
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      خصم 50% على الشحن
                    </span>
                  </label>

                  {paymentMethod === "instapay" && (
                    <div className="mt-4 p-4 rounded-xl bg-[#FDF8F5] border border-[#EDE0D4] space-y-3.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="text-[#9E8075] block text-[11px]">عنوان الدفع (IPA):</span>
                          <span className="text-sm sm:text-base font-black text-[#8B1A2E]">zahrastore@instapay</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("zahrastore@instapay", "insta")}
                          className="btn-outline h-9 px-3.5 text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedInsta ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedInsta ? "تم النسخ" : "نسخ العنوان"}</span>
                        </button>
                      </div>

                      <p className="text-emerald-700 font-bold leading-relaxed">
                        تم تطبيق خصم 50% على مصاريف الشحن لتصبح <span className="tabular-nums font-black">{formatPrice(shippingCost)}</span> فقط!
                      </p>

                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="اسم الحساب المحول منه أو رقم الإشعار"
                        className="input-field text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Billing Address Options (Matches reference image) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-[#1A0C08] mb-4">
                عنوان الفاتورة
              </h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <label className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="radio"
                    name="billing"
                    checked={formData.sameBilling}
                    onChange={() => setFormData({ ...formData, sameBilling: true })}
                    className="w-4 h-4 accent-[#8B1A2E]"
                  />
                  <span className="font-bold text-[#1A0C08]">مطابق لعنوان الشحن والتوصيل</span>
                </label>

                <label className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="radio"
                    name="billing"
                    checked={!formData.sameBilling}
                    onChange={() => setFormData({ ...formData, sameBilling: false })}
                    className="w-4 h-4 accent-[#8B1A2E]"
                  />
                  <span className="font-bold text-[#1A0C08]">استخدام عنوان فوترة مختلف</span>
                </label>

                {!formData.sameBilling && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={formData.differentBillingAddress}
                      onChange={(e) => setFormData({ ...formData, differentBillingAddress: e.target.value })}
                      placeholder="العنوان البديل للفاتورة بالتفصيل"
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button (Desktop & Primary) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full h-15 sm:h-16 text-base sm:text-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-[#8B1A2E]/25 hover:scale-[1.01] active:scale-98 disabled:opacity-50 transition-all"
            >
              <span>{isSubmitting ? "جاري تأكيد الطلب..." : `تأكيد وإتمام الطلب — ${formatPrice(grandTotal)}`}</span>
              <CheckCircle2 size={22} />
            </button>
          </form>

          {/* Right Column: Desktop Order Summary Box (5 cols) */}
          <div className="hidden lg:block lg:col-span-5 p-6 rounded-3xl bg-white border border-[#EDE0D4] shadow-sm sticky top-24">
            <h2 className="text-lg font-black text-[#1A0C08] pb-3 mb-4 border-b border-[#EDE0D4]">
              ملخص المشتريات ({itemCount} منتجات)
            </h2>

            {/* Items list */}
            <div className="max-h-72 overflow-y-auto space-y-3 mb-5 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                    <Image src={item.image || "/logo/zahra-logo.png"} alt={item.name} fill className="object-cover" />
                    <span className="absolute top-0 right-0 w-5 h-5 bg-[#8B1A2E] text-white text-[10px] font-black rounded-bl-lg flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A0C08] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#9E8075] mt-0.5">
                      {Object.values(item.selectedVariants || {}).join(" • ")}
                    </p>
                    {item.customChairImage && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="relative w-7 h-7 rounded-md overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                          <Image src={item.customChairImage} alt="صورة الكرسي" fill className="object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#8B1A2E] bg-[#FDF8F5] px-1.5 py-0.5 rounded border border-[#EDE0D4]">
                          📸 صورة الكرسي مرفقة للطلب العمولة
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#1A0C08]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount Code Form */}
            <form onSubmit={handleApplyCoupon} className="mb-5 pt-4 border-t border-[#EDE0D4]">
              <label className="text-xs font-bold text-[#5C4A42] block mb-1.5">
                كود الخصم (Discount Code)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="ادخلي الكود (مثال: ZAHRA10)"
                  className="input-field text-xs uppercase"
                  style={{ minHeight: 40, padding: "8px 12px" }}
                />
                <button
                  type="submit"
                  className="btn-outline h-10 px-4 text-xs font-bold flex-shrink-0"
                  style={{ minHeight: 40 }}
                >
                  تطبيق
                </button>
              </div>
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#5C4A42] pt-4 border-t border-[#EDE0D4]">
              <div className="flex justify-between">
                <span>المجموع الفرعي للطلب</span>
                <span className="font-bold text-[#1A0C08]">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>الخصم المطبق ({appliedCoupon})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>مصاريف الشحن ({formData.governorate})</span>
                <span className="font-bold text-[#1A0C08]">{formatPrice(shippingCost)}</span>
              </div>

              {paymentMethod === "instapay" && (
                <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">
                  ⚡ خصم 50% على الشحن مفعل لاختيارك إنستاباي!
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm sm:text-base font-black text-[#1A0C08]">المبلغ الإجمالي</span>
                <span className="text-2xl font-black text-[#8B1A2E]">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Policy Links matching reference screen */}
        <div className="mt-12 pt-6 border-t border-[#EDE0D4] flex flex-wrap items-center justify-center gap-4 text-xs text-[#9E8075]">
          <Link href="/return-policy" className="hover:underline">سياسة الاستبدال والاسترجاع</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:underline">سياسة الخصوصية</Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">الشروط والأحكام</Link>
          <span>•</span>
          <Link href="/shipping-info" className="hover:underline">معلومات التوصيل والشحن</Link>
        </div>
      </div>
    </div>
  );
}
