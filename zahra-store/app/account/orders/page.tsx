"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";
import { OrderService } from "@/lib/services/api";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { Package, ChevronLeft, ArrowLeft, Search, CheckCircle2 } from "lucide-react";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackingResults, setTrackingResults] = useState<Order[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    OrderService.getCustomerOrders().then((res) => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await OrderService.trackOrder(trackQuery.trim());
      setTrackingResults(results || []);
    } catch {
      setTrackingResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="container-zahra py-16 text-center text-sm font-bold text-[#5C4A42]">
        جاري تحميل طلباتك...
      </div>
    );
  }

  const displayedOrders = trackingResults !== null ? trackingResults : orders;

  return (
    <div className="container-zahra py-8 sm:py-12 max-w-4xl space-y-8">
      {/* Track Box */}
      <div className="p-6 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs">
        <h2 className="text-base font-bold text-[#1A0C08] mb-2 flex items-center gap-2">
          <Search size={18} className="text-[#8B1A2E]" />
          <span>تتبع أي طلب مباشر برقم الطلب أو الهاتف:</span>
        </h2>
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <input
            type="text"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            placeholder="مثال: ZHR-123456 أو 01012345678"
            className="flex-1 text-xs bg-[#FAF7F5] border border-[#EDE0D4] rounded-xl px-4 py-3 outline-none focus:border-[#8B1A2E]"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="btn-primary px-6 text-xs font-bold whitespace-nowrap"
          >
            {isSearching ? "جاري البحث..." : "تتبع الشحنة"}
          </button>
          {trackingResults !== null && (
            <button
              type="button"
              onClick={() => {
                setTrackingResults(null);
                setTrackQuery("");
              }}
              className="btn-outline px-4 text-xs font-bold"
            >
              إلغاء الفلتر
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-[#EDE0D4]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08]">
          {trackingResults !== null ? `نتائج البحث (${displayedOrders.length})` : `طلباتي السابقة (${displayedOrders.length})`}
        </h1>
        <Link href="/products" className="text-xs sm:text-sm font-bold text-[#8B1A2E] hover:underline">
          طلب جديد
        </Link>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#EDE0D4] p-8">
          <div className="w-16 h-16 rounded-full bg-[#FDF8F5] border border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] mx-auto mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#1A0C08] mb-2">
            لم نجد أي طلبات مطابقة
          </h3>
          <p className="text-xs text-[#9E8075] mb-6">
            تأكدي من كتابة رقم الطلب بالشكل الصحيح (مثال: ZHR-123456) أو رقم هاتفكِ المسجل في الفاتورة.
          </p>
          <Link href="/products" className="btn-primary h-11 px-6 text-xs font-bold inline-flex items-center gap-2">
            <span>تصفحي المتجر</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EDE0D4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FDF8F5] border border-[#EDE0D4] flex items-center justify-center text-[#8B1A2E] flex-shrink-0">
                  <Package size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1A0C08]">
                      طلب #{order.orderNumber}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {order.status === "confirmed" ? "تم الاستلام والتأكيد" : order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#9E8075] mt-1">
                    تاريخ الطلب: {formatDate(order.createdAt)} • {order.items?.length || 0} منتجات
                  </p>
                  <p className="text-xs font-bold text-[#8B1A2E] mt-1">
                    الإجمالي: {formatPrice(order.total)} ({order.address?.governorate || "مصر"})
                  </p>
                </div>
              </div>

              <Link
                href={`/order-confirmation/${order.id}`}
                className="btn-outline h-10 px-4 text-xs font-bold flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <span>تفاصيل الفاتورة والتوصيل</span>
                <ChevronLeft size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
