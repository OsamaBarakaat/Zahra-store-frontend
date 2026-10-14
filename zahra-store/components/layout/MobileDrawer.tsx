"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Home,
  Grid3X3,
  Tag,
  Heart,
  ShoppingBag,
  User,
  Phone,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { CategoryService } from "@/lib/services/api";
import { categories as initialCategories } from "@/lib/data/categories";
import { Category } from "@/lib/types";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
}

export default function MobileDrawer({ isOpen, onClose, categories }: MobileDrawerProps) {
  const [productsOpen, setProductsOpen] = useState(true);
  const [categoriesList, setCategoriesList] = useState<Category[]>(
    categories && categories.length > 0 ? categories : initialCategories
  );

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesList(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (isOpen) {
      CategoryService.getAll().then((cats) => {
        if (cats && cats.length > 0) setCategoriesList(cats);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="overlay"
          onClick={onClose}
          aria-hidden="true"
          style={{ zIndex: 9998 }}
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الرئيسية"
        className={`fixed top-0 right-0 bottom-0 z-[9999] w-[min(340px,88vw)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EDE0D4] bg-[#FDF8F5]">
          <Link href="/" onClick={onClose} className="relative w-28 h-12">
            <Image
              src="/logo/zahra-logo.png"
              alt="زهره ستور"
              fill
              className="object-contain object-right"
            />
          </Link>
          <button
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="w-10 h-10 rounded-full bg-white border border-[#EDE0D4] flex items-center justify-center text-[#8B1A2E] hover:bg-[#F2D4CC] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* الرئيسية */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-stone-800 font-bold hover:bg-[#FDF8F5] hover:text-[#8B1A2E] transition-colors cursor-pointer"
          >
            <Home size={20} className="text-[#8B1A2E]" />
            <span>الرئيسية</span>
          </Link>

          {/* المنتجات Accordion */}
          <div className="rounded-2xl border border-[#EDE0D4] bg-[#FDF8F5] overflow-hidden my-2">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className="w-full flex items-center justify-between p-4 text-[#8B1A2E] font-extrabold text-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <span>المنتجات والأقسام</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {productsOpen && (
              <div className="p-3 pt-0 space-y-1.5 border-t border-[#EDE0D4]/60">
                <Link
                  href="/products"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-[#8B1A2E] bg-white border border-[#EDE0D4]"
                >
                  ✨ تصفحي جميع المنتجات
                </Link>

                {categoriesList.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8B1A2E] hover:bg-white transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-stone-400">({cat.productCount})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* التصنيفات */}
          <Link
            href="/categories"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-stone-800 font-bold hover:bg-[#FDF8F5] hover:text-[#8B1A2E] transition-colors"
          >
            <Grid3X3 size={20} className="text-[#8B1A2E]" />
            <span>التصنيفات</span>
          </Link>

          {/* العروض */}
          <Link
            href="/offers"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <Tag size={20} />
              <span>العروض والخصومات</span>
            </div>
            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
              تخفيضات 🔥
            </span>
          </Link>

          {/* المفضلة */}
          <Link
            href="/account/wishlist"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-stone-800 font-bold hover:bg-[#FDF8F5] hover:text-[#8B1A2E] transition-colors"
          >
            <Heart size={20} className="text-[#8B1A2E]" />
            <span>المفضلة</span>
          </Link>

          {/* حسابي */}
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-stone-800 font-bold hover:bg-[#FDF8F5] hover:text-[#8B1A2E] transition-colors"
          >
            <User size={20} className="text-[#8B1A2E]" />
            <span>حسابي وطلباتي</span>
          </Link>
        </div>

        {/* Footer Guarantees & Socials */}
        <div className="p-5 border-t border-[#EDE0D4] bg-[#FDF8F5] space-y-4">
          <div className="space-y-1.5 text-xs text-[#5C4A42]">
            <p className="flex items-center gap-2 font-bold text-[#8B1A2E]">
              <Sparkles size={14} />
              <span>معاينة الطلب عند الاستلام متاحة</span>
            </p>
            <p className="flex items-center gap-2 text-stone-600">
              <Phone size={14} />
              <span>خدمة عملاء: 010 0000 0000</span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[#EDE0D4]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-[#EDE0D4] text-[#8B1A2E] flex items-center justify-center"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-[#EDE0D4] text-[#8B1A2E] flex items-center justify-center"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href="https://wa.me/20100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white border border-[#EDE0D4] text-emerald-600 flex items-center justify-center"
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
