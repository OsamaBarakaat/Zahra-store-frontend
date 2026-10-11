"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/lib/types";
import { OrderService } from "@/lib/services/api";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { Package, ChevronLeft, ArrowLeft } from "lucide-react";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getCustomerOrders().then((res) => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container-zahra py-16 text-center text-sm font-bold text-[#5C4A42]">
        جاري تحميل طلباتك...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-zahra py-16 text-center max-w-md mx-auto">
        <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4]">
          <div className="w-16 h-16 rounded-full bg-[#FDF8F5] border border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] mx-auto mb-4">
            <Package size={32} />
          </div>
          <h1 className="text-xl font-black text-[#1A0C08] mb-2">
            لا توجد طلبات سابقة 📦
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8075] mb-6">
            لم تقومي بطلب أي شحنة بعد. اختاري من مفروشاتنا الرائعة وسنصلكِ أينما كنتِ في مصر.
          </p>
          <Link href="/products" className="btn-primary w-full h-11 text-sm font-bold flex items-center justify-center gap-2">
            <span>تصفحي المتجر</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-zahra py-8 sm:py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE0D4]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08]">
          طلباتي السابقة ({orders.length})
        </h1>
        <Link href="/products" className="text-xs sm:text-sm font-bold text-[#8B1A2E] hover:underline">
          طلب جديد
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
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
                  تاريخ الطلب: {formatDate(order.createdAt)} • {order.items.length} منتجات
                </p>
                <p className="text-xs font-bold text-[#8B1A2E] mt-1">
                  الإجمالي: {formatPrice(order.total)} ({order.address.governorate})
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
    </div>
  );
}
