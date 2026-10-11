"use client";
import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useCartStore } from "@/lib/stores/cartStore";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

export default function AccountPage() {
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.getItemCount());

  const navItems = [
    {
      title: "طلباتي السابقة",
      desc: "تتبعي حالة شحناتك وتاريخ مشترياتك",
      href: "/account/orders",
      icon: Package,
      badge: null,
    },
    {
      title: "قائمة المفضلة",
      desc: "المنتجات التي قمتِ بحفظها للشراء لاحقاً",
      href: "/account/wishlist",
      icon: Heart,
      badge: wishlistCount > 0 ? `${wishlistCount} منتجات` : null,
    },
    {
      title: "سلة التسوق",
      desc: "معاينة السلة وإتمام الطلب",
      href: "/cart",
      icon: ShoppingBag,
      badge: cartCount > 0 ? `${cartCount} قطع` : null,
    },
    {
      title: "عناوين التوصيل",
      desc: "إدارة عناوين الشحن المحفوظة",
      href: "/account/addresses",
      icon: MapPin,
      badge: null,
    },
  ];

  return (
    <div className="container-zahra py-8 sm:py-12 max-w-4xl">
      {/* Header Profile Badge */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
        <div className="w-20 h-20 rounded-full bg-[#FDF8F5] border-2 border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] flex-shrink-0">
          <User size={38} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#1A0C08]">
            أهلاً بكِ في زهره ستور 🌸
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8075] mt-1">
            تسوقي بسهولة وسرعة كزائرة أو تابعي طلباتك السابقة
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-[#FDF8F5] border border-[#EDE0D4] text-xs text-[#5C4A42] flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#8B1A2E]" />
          <span>خدمة عملاء على مدار الساعة</span>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EDE0D4] hover:border-[#8B1A2E] hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FDF8F5] border border-[#EDE0D4] text-[#8B1A2E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#8B1A2E] group-hover:text-white transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] group-hover:text-[#8B1A2E] transition-colors">
                      {item.title}
                    </h2>
                    {item.badge && (
                      <span className="text-[10px] font-bold text-[#8B1A2E] bg-[#F2D4CC] px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9E8075] mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronLeft size={18} className="text-stone-400 group-hover:text-[#8B1A2E] transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
