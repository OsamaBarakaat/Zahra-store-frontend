import React from "react";
import Link from "next/link";
import { Truck, CheckCircle2 } from "lucide-react";
import { ShippingService } from "@/lib/services/api";

export const metadata = {
  title: "معلومات الشحن والتوصيل | زهره ستور",
  description: "تفاصيل مواعيد وأسعار شحن زهره ستور لجميع محافظات مصر.",
};

export default async function ShippingInfoPage() {
  const zones = await ShippingService.getZones();

  return (
    <div className="container-zahra py-10 sm:py-14 max-w-4xl">
      <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EDE0D4]">
          <div className="w-12 h-12 rounded-xl bg-[#FDF8F5] border border-[#E8A4A0] text-[#8B1A2E] flex items-center justify-center flex-shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A0C08]">
              معلومات الشحن والتوصيل
            </h1>
            <p className="text-xs text-[#9E8075] mt-0.5">
              توصيل سريع وآمن لجميع محافظات جمهورية مصر العربية
            </p>
          </div>
        </div>

        {/* Dynamic Live Shipping Rates Table */}
        {zones && zones.length > 0 && (
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>جدول أسعار التوصيل المعتمد حسب المحافظة:</span>
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[#EDE0D4]">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF7F5] text-[#5C4A42] border-b border-[#EDE0D4] font-bold">
                  <tr>
                    <th className="p-3.5">المحافظة</th>
                    <th className="p-3.5">تكلفة التوصيل</th>
                    <th className="p-3.5">المدة المتوقعة</th>
                    <th className="p-3.5">حالة التوصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE0D4]">
                  {zones.map((z) => (
                    <tr key={z.id} className="hover:bg-[#FDF8F5] transition-colors">
                      <td className="p-3.5 font-bold text-[#1A0C08]">{z.governorate_name_ar}</td>
                      <td className="p-3.5 font-bold text-[#8B1A2E]">{z.shipping_fee} ج.م</td>
                      <td className="p-3.5 text-[#5C4A42]">{z.estimated_days}</td>
                      <td className="p-3.5">
                        {z.is_active ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            متاح للتوصيل
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                            متوقف مؤقتاً
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="space-y-4 text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] pt-2">
            عرض إنستاباي الحصري ⚡
          </h2>
          <p className="text-emerald-700 font-bold bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
            عند الدفع المسبق عبر إنستاباي (InstaPay)، تحظين بخصم فوري 50% على قيمة الشحن لأي محافظة في مصر!
          </p>
        </div>

        <div className="pt-4 border-t border-[#EDE0D4]">
          <Link href="/products" className="btn-primary h-11 px-6 text-xs sm:text-sm font-bold inline-flex items-center gap-2">
            <span>تصفحي المنتجات الآن</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
