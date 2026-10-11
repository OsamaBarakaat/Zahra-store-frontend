import React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export const metadata = {
  title: "سياسة الاستبدال والاسترجاع | زهره ستور",
  description: "سياسة الاستبدال والاسترجاع المرنة لمتجر زهره ستور في مصر.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="container-zahra py-10 sm:py-14 max-w-3xl">
      <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EDE0D4]">
          <div className="w-12 h-12 rounded-xl bg-[#FDF8F5] border border-[#E8A4A0] text-[#8B1A2E] flex items-center justify-center flex-shrink-0">
            <RotateCcw size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A0C08]">
              سياسة الاستبدال والاسترجاع
            </h1>
            <p className="text-xs text-[#9E8075] mt-0.5">
              راحتك ورضاكِ التام هما هدفنا الأول دائماً
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            1. فترة الاسترجاع والاستبدال
          </h2>
          <p>
            يمكنكِ استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون المنتج بحالته الأصلية غير مستخدم ومعه غلافه وبطاقاته الأصلية.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            2. المعاينة مع المندوب
          </h2>
          <p>
            نوصي دائماً بمعاينة المنتج فور وصول المندوب. في حال وجود أي اختلاف أو رغبة في التبديل، يمكنكِ رفض الاستلام مع دفع مصاريف الشحن فقط.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            3. المنتجات المعيبة أو التالفة
          </h2>
          <p>
            في حال وجود أي عيب صناعة، يتم استبدال المنتج فوراً مجاناً دون أي مصاريف شحن إضافية.
          </p>
        </div>

        <div className="pt-4 border-t border-[#EDE0D4]">
          <Link href="/products" className="text-xs font-bold text-[#8B1A2E] hover:underline">
            العودة لمنتجات زهره ستور
          </Link>
        </div>
      </div>
    </div>
  );
}
