"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types";
import { OrderService } from "@/lib/services/api";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { CheckCircle2, ShoppingBag, Truck, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    OrderService.getOrderById(orderId).then((res) => {
      setOrder(res);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="container-zahra py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#8B1A2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-[#5C4A42]">جاري تحميل بيانات طلبك...</p>
      </div>
    );
  }

  return (
    <div className="container-zahra py-10 sm:py-16 max-w-3xl">
      {/* Celebration Header */}
      <div className="text-center p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-sm mb-8">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 size={44} />
        </div>

        <span className="text-xs font-bold text-[#8B1A2E] bg-[#FDF8F5] px-3.5 py-1 rounded-full border border-[#EDE0D4]">
          رقم الطلب: {order?.orderNumber || orderId}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08] mt-3 mb-2">
          تم استلام طلبك بنجاح ❤️
        </h1>

        <p className="text-sm text-[#5C4A42] max-w-md mx-auto leading-relaxed">
          شكراً لثقتك في زهره ستور! تم تسجيل طلبك وسيقوم فريق العمل بتجهيزه فوراً والتواصل معكِ لتأكيد ميعاد التسليم.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-[#EDE0D4]">
          <a
            href="https://wa.me/20100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline h-11 px-5 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <WhatsAppIcon size={18} />
            <span>تأكيد سريع عبر الواتساب</span>
          </a>
          <Link
            href="/products"
            className="btn-primary h-11 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <span>متابعة التسوق</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="p-6 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EDE0D4]">
            <div>
              <h2 className="text-base font-bold text-[#1A0C08]">تفاصيل الشحن والتوصيل</h2>
              <p className="text-xs text-[#9E8075] mt-0.5">
                المحافظة: {order.address.governorate} • {order.address.city}
              </p>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {order.status === "confirmed" ? "تم التأكيد" : order.status}
              </span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C4A42] bg-[#FDF8F5] p-4 rounded-2xl border border-[#EDE0D4]">
            <div>
              <p className="font-bold text-[#1A0C08] mb-1">العميل:</p>
              <p>{order.customer.firstName} {order.customer.lastName}</p>
              <p className="dir-ltr text-right">{order.customer.phone}</p>
            </div>
            <div>
              <p className="font-bold text-[#1A0C08] mb-1">العنوان بالتفصيل:</p>
              <p>{order.address.street}</p>
              {order.address.apartment && <p>{order.address.apartment}</p>}
            </div>
          </div>

          {/* Ordered Products List */}
          <div>
            <h3 className="text-sm font-bold text-[#1A0C08] mb-3">المنتجات المطلوبة:</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-2 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A0C08]">{item.name}</p>
                      <p className="text-[11px] text-[#9E8075]">
                        الكمية: {item.quantity} • {Object.values(item.selectedVariants || {}).join(" - ")}
                      </p>
                      {item.customChairImage && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="relative w-7 h-7 rounded-md overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                            <Image src={item.customChairImage} alt="صورة الكرسي المرفقة" fill className="object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-[#8B1A2E]">
                            📸 صورة الكرسي مرفقة للتفصيل العمولة
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1A0C08]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financials */}
          <div className="pt-4 border-t border-[#EDE0D4] space-y-2 text-xs sm:text-sm text-[#5C4A42]">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>الخصم المطبق</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>مصاريف الشحن</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#1A0C08] pt-2 border-t border-stone-200">
              <span>المبلغ الإجمالي</span>
              <span className="text-[#8B1A2E]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
