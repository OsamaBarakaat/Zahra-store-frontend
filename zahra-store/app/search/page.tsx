"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles, ArrowLeft } from "lucide-react";
import { searchProducts } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { Product, Category } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Product[]>([]);
  const [matchedCategories, setMatchedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (initialQ) {
      setQuery(initialQ);
      const matched = searchProducts(initialQ);
      const qLower = initialQ.toLowerCase().trim();
      const catMatches = categories.filter(
        (c) => c.name.includes(qLower) || c.description?.includes(qLower)
      );
      setResults(matched);
      setMatchedCategories(catMatches);
    } else {
      setResults([]);
      setMatchedCategories([]);
    }
  }, [initialQ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="container-zahra py-8 sm:py-12">
      {/* Top Search Input Box */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08] mb-2">
          البحث في متجر زهره
        </h1>
        <p className="text-xs sm:text-sm text-[#9E8075] mb-6">
          ابحثي عن أي منتج، خامة، أو قسم بكل سهولة
        </p>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحثي عن بياضات، بيجامات، إسدالات، طرح، مفروشات..."
            className="input-field h-14 pr-12 pl-24 rounded-full text-sm sm:text-base border-2 shadow-sm"
          />
          <Search size={22} className="absolute right-4 text-[#8B1A2E] pointer-events-none" />
          <button
            type="submit"
            className="btn-primary absolute left-2 h-10 px-5 text-xs sm:text-sm font-bold"
          >
            بحث
          </button>
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-[#9E8075]">اقتراحات:</span>
          {["بياضات", "قطن", "بيجامات حريمي", "إسدالات", "طرح", "غطاء كنبة"].map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickTag(tag)}
              className="text-xs px-3 py-1 rounded-full bg-white border border-[#EDE0D4] text-[#5C4A42] hover:border-[#8B1A2E] hover:text-[#8B1A2E] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {initialQ && (
        <div className="mb-8 pb-4 border-b border-[#EDE0D4] flex flex-col sm:flex-row items-baseline justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A0C08]">
            نتائج البحث عن &ldquo;<span className="text-[#8B1A2E]">{initialQ}</span>&rdquo;
          </h2>
          <span className="text-xs text-[#9E8075]">
            تم العثور على {results.length} منتج
          </span>
        </div>
      )}

      {/* Matched Categories Badges */}
      {matchedCategories.length > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-[#FDF8F5] border border-[#EDE0D4]">
          <h3 className="text-xs font-bold text-[#9E8075] uppercase mb-2">
            أقسام ذات صلة بالبحث:
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedCategories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EDE0D4] text-xs font-bold text-[#8B1A2E] hover:bg-[#F2D4CC]"
              >
                <span>{c.name}</span>
                <span className="text-[10px] text-[#9E8075]">({c.productCount} منتج)</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {initialQ ? (
        <ProductGrid
          products={results}
          emptyMessage={`لم نجد منتجات تطابق "${initialQ}". جربي البحث بكلمات أخرى أو تصفحي أقسامنا.`}
        />
      ) : (
        <div className="py-12 text-center text-sm text-[#9E8075]">
          اكتبي كلمة البحث أعلاه للعثور على المنتجات المطلوبة
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-zahra py-16 text-center">جاري التحميل...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
