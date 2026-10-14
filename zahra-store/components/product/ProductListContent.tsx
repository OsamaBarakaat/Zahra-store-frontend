"use client";
import React, { useState, useMemo } from "react";
import { Product, Category, SortOption } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import { SlidersHorizontal, X, Check, ArrowUpDown, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

interface ProductListContentProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ProductListContent({
  initialProducts,
  categories,
  initialCategory,
}: ProductListContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("newest");
  const [onlySale, setOnlySale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (onlySale) {
      list = list.filter((p) => p.isOnSale || (p.discount && p.discount > 0));
    }

    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    switch (selectedSort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "top_rated":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "best_selling":
        list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "newest":
      default:
        // maintain order or ID
        break;
    }

    return list;
  }, [initialProducts, selectedCategory, selectedSort, onlySale, onlyInStock]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setOnlySale(false);
    setOnlyInStock(false);
    setSelectedSort("newest");
  };

  const hasActiveFilters = selectedCategory !== "all" || onlySale || onlyInStock;

  return (
    <div className="container-zahra py-10 sm:py-16 lg:py-20">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#EDE0D4]">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A0C08] tracking-tight">
            {selectedCategory !== "all"
              ? categories.find((c) => c.slug === selectedCategory)?.name || "المنتجات"
              : "جميع المنتجات"}
          </h1>
          <p className="text-sm text-[#7A645A] mt-2">
            عرض <span className="tabular-nums font-bold text-[#8B1A2E]">{filteredProducts.length}</span> من أصل <span className="tabular-nums font-bold text-[#8B1A2E]">{initialProducts.length}</span> منتج مختار بعناية
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex-1 sm:flex-none h-12 px-5 rounded-2xl bg-white border border-[#EDE0D4] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal size={17} className="text-[#8B1A2E]" />
            <span>فلترة المنتجات</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#8B1A2E]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              aria-label="ترتيب المنتجات"
              className="w-full sm:w-auto h-12 pr-10 pl-5 rounded-2xl bg-white border border-[#EDE0D4] text-xs sm:text-sm font-bold text-[#1A0C08] outline-none focus:border-[#8B1A2E] cursor-pointer shadow-xs"
            >
              <option value="newest">الترتيب: الأحدث أولاً</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
              <option value="top_rated">الأعلى تقييماً</option>
              <option value="best_selling">الأكثر طلباً ومبيعاً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout with generous gap */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 p-6 sm:p-7 rounded-[28px] bg-white border border-[#EDE0D4] sticky top-28 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EDE0D4]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1A0C08]">
              <Filter size={17} className="text-[#8B1A2E]" />
              <span>خيارات التصفية</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#8B1A2E] font-bold hover:underline cursor-pointer"
              >
                مسح الكل
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-[#9E8075] uppercase tracking-wider mb-2.5">
              الأقسام والتصنيفات
            </h4>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center justify-between text-right px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#FDF8F5] text-[#8B1A2E] font-bold"
                    : "text-[#5C4A42] hover:bg-stone-50"
                }`}
              >
                <span>الكل</span>
                <span className="text-xs opacity-60 tabular-nums font-bold">{initialProducts.length}</span>
              </button>
              {categories.map((c) => {
                const count = initialProducts.filter((p) => p.category === c.slug).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`flex items-center justify-between text-right px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      selectedCategory === c.slug
                        ? "bg-[#FDF8F5] text-[#8B1A2E] font-bold"
                        : "text-[#5C4A42] hover:bg-stone-50"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs opacity-60 tabular-nums font-bold">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="pt-4 border-t border-[#EDE0D4] flex flex-col gap-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-medium text-[#1A0C08]">
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
                className="w-4 h-4 rounded text-[#8B1A2E] focus:ring-[#8B1A2E] accent-[#8B1A2E]"
              />
              <span>العروض والتخفيضات فقط</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-medium text-[#1A0C08]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#8B1A2E] focus:ring-[#8B1A2E] accent-[#8B1A2E]"
              />
              <span>المنتجات المتوفرة فقط بالمخزون</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="col-span-1 md:col-span-3">
          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-[#9E8075]">الفلاتر المفعلة:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F2D4CC] text-[#8B1A2E] text-xs font-bold">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")} className="cursor-pointer hover:opacity-70 transition-opacity">
                    <X size={13} />
                  </button>
                </span>
              )}
              {onlySale && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  تخفيضات فقط
                  <button onClick={() => setOnlySale(false)} className="cursor-pointer hover:opacity-70 transition-opacity">
                    <X size={13} />
                  </button>
                </span>
              )}
              {onlyInStock && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-bold">
                  متوفر فقط
                  <button onClick={() => setOnlyInStock(false)} className="cursor-pointer hover:opacity-70 transition-opacity">
                    <X size={13} />
                  </button>
                </span>
              )}
            </div>
          )}

          <ProductGrid products={filteredProducts} />
        </div>
      </div>

      {/* Mobile Bottom-Sheet Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="overlay"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-t-3xl p-6 z-10 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EDE0D4]">
              <h3 className="text-base font-bold text-[#1A0C08]">تصفية المنتجات</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-9 h-9 rounded-full bg-[#FDF8F5] flex items-center justify-center text-[#8B1A2E] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-[#9E8075] uppercase mb-3">القسم</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    selectedCategory === "all"
                      ? "border-[#8B1A2E] bg-[#FDF8F5] text-[#8B1A2E]"
                      : "border-stone-200 text-stone-700"
                  }`}
                >
                  الكل ({initialProducts.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      selectedCategory === c.slug
                        ? "border-[#8B1A2E] bg-[#FDF8F5] text-[#8B1A2E]"
                        : "border-stone-200 text-stone-700"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 mb-6 pt-2 border-t border-[#EDE0D4]">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 text-xs font-bold text-stone-800 cursor-pointer">
                <span>العروض والتخفيضات فقط 🏷️</span>
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="w-4 h-4 accent-[#8B1A2E] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 text-xs font-bold text-stone-800 cursor-pointer">
                <span>المتوفر بالمخزون فقط</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 accent-[#8B1A2E] cursor-pointer"
                />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearAllFilters}
                className="btn-outline flex-1 h-12 text-xs font-bold cursor-pointer"
              >
                مسح الفلاتر
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-primary flex-1 h-12 text-xs font-bold cursor-pointer"
              >
                تطبيق ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
