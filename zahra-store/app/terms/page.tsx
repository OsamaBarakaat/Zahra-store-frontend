import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "الشروط والأحكام | زهره ستور",
  description: "الشروط والأحكام الخاصة بالتسوق والطلب في متجر زهره ستور.",
};

export default function TermsPage() {
  return (
    <div className="container-zahra py-10 sm:py-14 max-w-3xl">
      <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EDE0D4]">
          <div className="w-12 h-12 rounded-xl bg-[#FDF8F5] border border-[#E8A4A0] text-[#8B1A2E] flex items-center justify-center flex-shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A0C08]">
              الشروط والأحكام
            </h1>
            <p className="text-xs text-[#9E8075] mt-0.5">
              قواعد وضوابط التسوق المريح في متجر زهره ستور
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            1. الطلب والأسعار
          </h2>
          <p>
            جميع الأسعار المعروضة على الموقع بالجنيه المصري (EGP). نحرص على دقة تفاصيل الأسعار والمخزون، ويحق للمتجر تأكيد توافر المنتج قبل إرسال الشحنة.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            2. تأكيد الطلب والعربون
          </h2>
          <p>
            لتجهيز طلبك بعناية، قد تتطلب بعض المنتجات أو الطلبات الخاصة دفع عربون تأكيد بسيط. يتواصل معك فريق العمل هاتفياً أو عبر الواتساب لإتمام التأكيد وتوضيح موعد الشحن.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08]">
            3. المعاينة والاستلام
          </h2>
          <p>
            يحق للعميلة معاينة المنتج ظاهرياً عند الاستلام للتأكد من المقاس واللون والنوعية قبل السداد للمندوب.
          </p>
        </div>

        <div className="pt-4 border-t border-[#EDE0D4]">
          <Link href="/products" className="text-xs font-bold text-[#8B1A2E] hover:underline">
            العودة للتسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
