"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  User,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Tag,
  Flame,
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useSearchStore } from "@/lib/stores/searchStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/format";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const openSearch = useSearchStore((s) => s.openSearch);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setProductsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setProductsMenuOpen(false);
    }, 350);
  };

  // 3 featured items for the mega menu
  const menuFeatured = products.slice(0, 3);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FDF8F5]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(139,26,46,0.06)] border-b border-black/[0.04]"
            : "bg-[#FDF8F5]/95 backdrop-blur-md border-b border-[#EDE0D4]/70"
        }`}
        style={{ height: "var(--header-height, 72px)" }}
      >
        <div className="container-zahra h-full flex items-center justify-between gap-6">
          {/* Logo with Apple-like micro hover */}
          <Link
            href="/"
            aria-label="زهره ستور - الرئيسية"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-102 flex-shrink-0"
          >
            <div className="relative w-28 h-12 sm:w-32 sm:h-14">
              <Image
                src="/logo.png"
                alt="زهره ستور"
                fill
                priority
                className="object-contain object-right"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1.5 lg:gap-2.5 h-full"
            aria-label="القائمة الرئيسية"
          >
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-[15px] font-semibold text-[#5C4A42] hover:text-[#8B1A2E] hover:bg-white/80 transition-all duration-200"
            >
              الرئيسية
            </Link>

            {/* Apple-style "المنتجات" with special hover states & mega menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/products"
                className={`relative px-5 py-2.5 rounded-full text-[15px] font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  productsMenuOpen
                    ? "bg-[#8B1A2E] text-white shadow-md shadow-[#8B1A2E]/20 scale-102"
                    : "text-[#1A0C08] hover:text-[#8B1A2E] hover:bg-white/80"
                }`}
              >
                <span>المنتجات</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-300 ${
                    productsMenuOpen ? "rotate-180 text-white" : "text-[#9E8075]"
                  }`}
                />
              </Link>

              {/* Invisible bridge to prevent gap-related mouseleave */}
              {productsMenuOpen && (
                <div className="absolute top-full right-0 left-0 h-4 pointer-events-auto" />
              )}

              {/* Apple-style Luxury Mega Menu */}
              {productsMenuOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] right-1/2 translate-x-1/2 w-[840px] max-w-[94vw] bg-white/95 backdrop-blur-2xl rounded-3xl border border-[#EDE0D4] shadow-[0_20px_60px_rgba(26,12,8,0.14)] p-8 transition-all duration-300 animate-in fade-in zoom-in-95 z-50 text-right"
                >
                  <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Column 1: Categories (5 cols) */}
                    <div className="col-span-5 border-l border-[#F5EDE6] pl-6">
                      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#F5EDE6]">
                        <Sparkles size={16} className="text-[#8B1A2E]" />
                        <h3 className="text-xs font-bold text-[#8B1A2E] uppercase tracking-wider">
                          تصفحي حسب القسم
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            onClick={() => setProductsMenuOpen(false)}
                            className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#FDF8F5] border border-transparent hover:border-[#EDE0D4] transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200 group-hover:scale-105 transition-transform">
                                <Image
                                  src={cat.image}
                                  alt={cat.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-[#1A0C08] group-hover:text-[#8B1A2E] transition-colors block">
                                  {cat.name}
                                </span>
                                <span className="text-[11px] text-[#9E8075] mt-0.5 block">
                                  {cat.productCount} منتج متوفر
                                </span>
                              </div>
                            </div>
                            <ArrowLeft
                              size={15}
                              className="text-stone-300 group-hover:text-[#8B1A2E] group-hover:-translate-x-1 transition-all"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Featured Picks (4 cols) */}
                    <div className="col-span-4 border-l border-[#F5EDE6] pl-6">
                      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#F5EDE6]">
                        <Flame size={16} className="text-[#DC2626]" />
                        <h3 className="text-xs font-bold text-[#1A0C08] uppercase tracking-wider">
                          الأكثر طلباً هذا الأسبوع
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        {menuFeatured.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => setProductsMenuOpen(false)}
                            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FDF8F5] transition-all"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200 group-hover:scale-105 transition-transform">
                              <Image
                                src={p.images[0]?.url || "/logo.png"}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1A0C08] group-hover:text-[#8B1A2E] truncate">
                                {p.name}
                              </p>
                              <p className="text-xs font-extrabold text-[#8B1A2E] mt-1">
                                {formatPrice(p.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Exclusive Promo Card (3 cols) */}
                    <div className="col-span-3 flex flex-col justify-between h-full">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#8B1A2E] to-[#6B1322] text-white shadow-md relative overflow-hidden">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full inline-block mb-3">
                          كود خصم حصري 🏷️
                        </span>
                        <h4 className="text-sm font-black mb-2">وفّري 10% إضافية</h4>
                        <p className="text-[11px] text-white/85 mb-4 leading-relaxed">
                          استخدمي كود <strong className="text-white underline">ZAHRA10</strong> عند الدفع.
                        </p>
                        <Link
                          href="/offers"
                          onClick={() => setProductsMenuOpen(false)}
                          className="w-full h-9 rounded-full bg-white text-[#8B1A2E] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#FDF8F5] transition-all"
                        >
                          <span>عرض الخصومات</span>
                          <ArrowLeft size={13} />
                        </Link>
                      </div>

                      {/* View All Products button */}
                      <Link
                        href="/products"
                        onClick={() => setProductsMenuOpen(false)}
                        className="mt-5 flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#FDF8F5] border border-[#EDE0D4] text-xs font-bold text-[#8B1A2E] hover:bg-[#8B1A2E] hover:text-white transition-all duration-200"
                      >
                        <span>تصفحي جميع المنتجات</span>
                        <ArrowLeft size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/categories"
              className="px-4 py-2 rounded-full text-[15px] font-semibold text-[#5C4A42] hover:text-[#8B1A2E] hover:bg-white/80 transition-all duration-200"
            >
              التصنيفات
            </Link>

            <Link
              href="/offers"
              className="px-4 py-2 rounded-full text-[15px] font-semibold text-[#DC2626] hover:bg-red-50/80 transition-all duration-200 flex items-center gap-1.5"
            >
              <Tag size={15} />
              <span>العروض</span>
            </Link>
          </nav>

          {/* Action Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <button
              onClick={openSearch}
              aria-label="البحث في الموقع"
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#5C4A42] hover:text-[#8B1A2E] hover:bg-white/90 border border-transparent hover:border-[#EDE0D4] transition-all duration-200"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              aria-label="المفضلة"
              className="relative w-11 h-11 rounded-full hidden sm:flex items-center justify-center text-[#5C4A42] hover:text-[#8B1A2E] hover:bg-white/90 border border-transparent hover:border-[#EDE0D4] transition-all duration-200"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-[#8B1A2E] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart with glowing counter */}
            <button
              onClick={openCart}
              aria-label={`السلة — ${itemCount} منتج`}
              className="relative h-11 px-3.5 sm:px-4 rounded-full bg-white border border-[#EDE0D4] hover:border-[#8B1A2E] shadow-xs flex items-center gap-2 text-[#1A0C08] hover:text-[#8B1A2E] transition-all duration-200 active:scale-95"
            >
              <ShoppingBag size={19} className="text-[#8B1A2E]" />
              <span className="hidden xs:inline text-xs font-bold">السلة</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8B1A2E] text-white text-[11px] font-extrabold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Account — desktop */}
            <Link
              href="/account"
              aria-label="حسابي"
              className="w-11 h-11 rounded-full hidden md:flex items-center justify-center text-[#5C4A42] hover:text-[#8B1A2E] hover:bg-white/90 border border-transparent hover:border-[#EDE0D4] transition-all duration-200"
            >
              <User size={20} />
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="فتح القائمة"
              className="w-11 h-11 rounded-full md:hidden flex items-center justify-center text-[#1A0C08] bg-white border border-[#EDE0D4] shadow-xs active:scale-95"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
