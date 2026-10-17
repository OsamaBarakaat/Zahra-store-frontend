"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useSearchStore } from "@/lib/stores/searchStore";
import { ProductService, CategoryService } from "@/lib/services/api";
import { Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";

export default function SearchModal() {
  const router = useRouter();
  const {
    isOpen,
    query,
    results,
    categoryResults,
    closeSearch,
    setQuery,
    setResults,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [cachedCategories, setCachedCategories] = React.useState<Category[]>(
    []
  );

  useEffect(() => {
    if (isOpen && cachedCategories.length === 0) {
      CategoryService.getAll().then((cats) => setCachedCategories(cats));
    }
  }, [isOpen, cachedCategories.length]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([], []);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(async () => {
      const qLower = val.toLowerCase().trim();
      const [matchedProducts, allCats] = await Promise.all([
        ProductService.search(val),
        cachedCategories.length > 0
          ? Promise.resolve(cachedCategories)
          : CategoryService.getAll(),
      ]);

      const matchedCategories = allCats.filter(
        (c) =>
          c.name.toLowerCase().includes(qLower) ||
          c.description?.toLowerCase().includes(qLower)
      );

      setResults(matchedProducts, matchedCategories);
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="البحث في المتجر"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        background: "rgba(26, 12, 8, 0.65)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "0 10px 40px rgba(139, 26, 46, 0.12)",
          padding: "20px 0 16px",
          width: "100%",
        }}
      >
        <div className="container-zahra">
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search
                size={22}
                style={{
                  position: "absolute",
                  right: 16,
                  color: "var(--color-primary)",
                  pointerEvents: "none",
                }}
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="ابحثي عن بياضات، بيجامات، إسدالات، طرح، مفروشات..."
                aria-label="خانة البحث"
                style={{
                  width: "100%",
                  height: 52,
                  paddingRight: 50,
                  paddingLeft: 40,
                  borderRadius: 999,
                  border: "2px solid var(--color-border)",
                  background: "var(--color-warm-white)",
                  fontSize: 16,
                  color: "var(--color-text)",
                  outline: "none",
                  fontFamily: "inherit",
                }}
                className="focus:border-[#8B1A2E] focus:bg-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  aria-label="مسح البحث"
                  style={{
                    position: "absolute",
                    left: 14,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-muted)",
                    padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={closeSearch}
              style={{
                background: "var(--color-blush)",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label="إغلاق البحث"
            >
              <X size={20} />
            </button>
          </form>

          {/* Quick Suggestions when empty */}
          {!query.trim() && (
            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: "1px dashed var(--color-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  fontSize: 13,
                  color: "var(--color-muted)",
                }}
              >
                <Sparkles
                  size={15}
                  style={{ color: "var(--color-secondary)" }}
                />
                <span>عمليات البحث الشائعة:</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  "طقم بياضات قطن",
                  "بيجاما حرير",
                  "ستارة مخمل",
                  "طرحة شيفون",
                  "غطاء كنبة",
                  "إسدالات",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSearchChange(tag)}
                    style={{
                      background: "var(--color-warm-white)",
                      border: "1px solid var(--color-border)",
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                      color: "var(--color-text-soft)",
                      cursor: "pointer",
                    }}
                    className="hover:border-[#8B1A2E] hover:text-[#8B1A2E]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Dropdown Container */}
      <div
        onClick={closeSearch}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 0 40px",
        }}
      >
        <div className="container-zahra" onClick={(e) => e.stopPropagation()}>
          {query.trim() && (
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: 20,
                padding: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                maxHeight: "calc(80vh - 120px)",
                overflowY: "auto",
              }}
            >
              {categoryResults.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--color-muted)",
                      marginBottom: 10,
                    }}
                  >
                    التصنيفات المطابقة:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {categoryResults.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={closeSearch}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "var(--color-warm-white)",
                          border: "1px solid var(--color-border)",
                          padding: "6px 16px",
                          borderRadius: 999,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-primary)",
                        }}
                        className="hover:bg-blush"
                      >
                        <span>{cat.name}</span>
                        <span
                          style={{ fontSize: 11, color: "var(--color-muted)" }}
                        >
                          ({cat.productCount} منتج)
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--color-text)",
                  }}
                >
                  المنتجات ({results.length})
                </h4>
                {results.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span>عرض كل النتائج</span>
                    <ArrowLeft size={14} />
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--color-text-soft)",
                      marginBottom: 6,
                    }}
                  >
                    لم نجد منتجات تطابق &quot;{query}&quot;
                  </p>
                  <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
                    جربي البحث بكلمات أخرى مثل &quot;بياضات&quot; أو
                    &quot;قطن&quot; أو &quot;بيجاما&quot;
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  {results.slice(0, 8).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 10,
                        borderRadius: 12,
                        background: "var(--color-warm-white)",
                        border: "1px solid var(--color-border-light)",
                        transition: "transform 0.15s, border-color 0.15s",
                      }}
                      className="hover:border-[#8B1A2E]"
                    >
                      <div
                        style={{
                          position: "relative",
                          width: 56,
                          height: 56,
                          borderRadius: 8,
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={
                            product.images[0]?.url || "/logo/zahra-logoo.png"
                          }
                          alt={product.name}
                          fill
                          sizes="56px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--color-text)",
                            marginBottom: 4,
                          }}
                          className="line-clamp-1"
                        >
                          {product.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "var(--color-primary)",
                            }}
                          >
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--color-muted)",
                                textDecoration: "line-through",
                              }}
                            >
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
