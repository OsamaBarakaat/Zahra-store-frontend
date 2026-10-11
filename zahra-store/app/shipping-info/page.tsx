import React from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

export const metadata = {
  title: "معلومات الشحن والتوصيل | زهره ستور",
  description: "تفاصيل مواعيد وأسعار شحن زهره ستور لجميع محافظات مصر.",
};

export default function ShippingInfoPage() {
  return (
    <div className="container-zahra py-10 sm:py-14 max-w-3xl">
      <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs space-y-6">
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

        <div className="space-y-4 text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            1. مدة التوصيل
          </h2>
          <ul className="list-disc list-inside space-y-1.5 mr-2">
            <li><strong>القاهرة والجيزة:</strong> خلال 24 - 48 ساعة عمل.</li>
            <li><strong>الإسكندرية ومحافظات الدلتا والقناة:</strong> خلال 2 - 3 أيام عمل.</li>
            <li><strong>محافظات الصعيد:</strong> خلال 3 - 4 أيام عمل.</li>
            <li><strong>المحافظات الحدودية (مطروح، سيناء، البحر الأحمر، الوادي الجديد):</strong> خلال 4 - 5 أيام عمل.</li>
          </ul>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] pt-2">
            2. مصاريف الشحن
          </h2>
          <p>
            تبدأ مصاريف الشحن من 65 جنيه داخل القاهرة والجيزة، ويتم توضيح القيمة الدقيقة تلقائياً في صفحة إتمام الطلب بمجرد اختيار محافظتكِ.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] pt-2">
            3. عرض إنستاباي الحصري ⚡
          </h2>
          <p className="text-emerald-700 font-bold">
            عند الدفع المسبق عبر إنستاباي، تحظين بخصم فوري 50% على قيمة الشحن لأي محافظة في مصر!
          </p>
        </div>

        <div className="pt-4 border-t border-[#EDE0D4]">
          <Link href="/products" className="text-xs font-bold text-[#8B1A2E] hover:underline">
            ابدأي التسوق الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
