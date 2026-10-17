"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatPrice } from "@/lib/utils/format";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const count = getItemCount();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="overlay"
        onClick={closeCart}
        style={{ zIndex: 9990 }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلة المشتريات"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "min(420px, 92vw)",
          background: "var(--color-surface)",
          zIndex: 9995,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(26, 12, 8, 0.16)",
          transition: "transform 0.3s ease",
          animation: "slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid var(--color-border-light)",
            background: "var(--color-warm-white)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--color-blush)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--color-text)",
                }}
              >
                سلة التسوق
              </h3>
              <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
                {count > 0 ? `${count} منتجات` : "فارغة"}
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="إغلاق السلة"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "transparent",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-soft)",
              cursor: "pointer",
            }}
            className="hover:bg-blush hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--color-warm-white)",
                border: "2px dashed var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-muted)",
                marginBottom: 16,
              }}
            >
              <ShoppingBag size={36} />
            </div>
            <h4
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                color: "var(--color-text)",
              }}
            >
              سلتك فارغة حالياً
            </h4>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-muted)",
                maxWidth: 240,
                marginBottom: 24,
              }}
            >
              استكشفي أحدث مفروشاتنا وبياضاتنا واختاري ما يناسب بيتك وأناقتك.
            </p>
            <button
              onClick={() => {
                closeCart();
                router.push("/products");
              }}
              className="btn-primary"
              style={{ width: "100%", maxWidth: 220 }}
            >
              ابدأي التسوق الآن
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {items.map((item) => {
                const variantDetails = Object.entries(
                  item.selectedVariants || {}
                )
                  .map(([k, v]) => `${v}`)
                  .join(" • ");

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px",
                      borderRadius: 14,
                      background: "var(--color-warm-white)",
                      border: "1px solid var(--color-border-light)",
                    }}
                  >
                    {/* Item Image */}
                    <div
                      style={{
                        position: "relative",
                        width: 72,
                        height: 72,
                        borderRadius: 10,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={item.image || "/logo/zahra-logoo.png"}
                        alt={item.name}
                        fill
                        sizes="72px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* Item Details */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--color-text)",
                              lineHeight: 1.4,
                            }}
                            className="line-clamp-2 hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`حذف ${item.name}`}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--color-muted)",
                              cursor: "pointer",
                              padding: 2,
                            }}
                            className="hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {variantDetails && (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--color-muted)",
                              marginTop: 2,
                              display: "block",
                            }}
                          >
                            {variantDetails}
                          </span>
                        )}

                        {item.customChairImage && (
                          <div
                            style={{
                              marginTop: 6,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                overflow: "hidden",
                                border: "1px solid var(--color-border)",
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                src={item.customChairImage}
                                alt="صورة كرسي العميل"
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--color-primary)",
                                fontWeight: 700,
                              }}
                            >
                              📸 صورة كرسي العميل مرفقة
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--color-primary)",
                          }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        {/* Quantity Counter */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 999,
                            padding: "2px 6px",
                            gap: 8,
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="تقليل الكمية"
                            style={{
                              background: "none",
                              border: "none",
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "var(--color-text-soft)",
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              minWidth: 16,
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="زيادة الكمية"
                            style={{
                              background: "none",
                              border: "none",
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "var(--color-text-soft)",
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Checkout */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--color-border-light)",
                background: "var(--color-surface)",
                boxShadow: "0 -4px 16px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 14, color: "var(--color-text-soft)" }}>
                  المجموع الفرعي
                </span>
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--color-primary)",
                  }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-muted)",
                  marginBottom: 12,
                }}
              >
                يتم حساب تكلفة الشحن بدقة في الخطوة التالية حسب محافظتك.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  marginBottom: 14,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#065F46",
                }}
              >
                <span style={{ fontSize: 15 }}>⚡</span>
                <span>
                  خصم 50% على الشحن عند الدفع بإنستاباي أو فودافون كاش
                </span>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <button
                  onClick={handleCheckout}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    height: 48,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  <span>إتمام الطلب الآن</span>
                  <ArrowLeft size={18} />
                </button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-outline"
                  style={{
                    width: "100%",
                    height: 44,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  معاينة السلة كاملة
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
