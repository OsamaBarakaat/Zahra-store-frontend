import React from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Tag, Sparkles } from "lucide-react";

export default function OffersBanner() {
  return (
    <section className="py-12 sm:py-20">
      <div className="container-zahra">
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-gradient-to-r from-[#590E1B] via-[#8B1A2E] to-[#A93048] text-white p-8 sm:p-14 lg:p-20 shadow-[0_20px_60px_rgba(139,26,46,0.18)]">
          {/* Subtle Ambient Shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-black/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="text-center md:text-right max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-white/20 shadow-sm">
                <Flame size={16} className="text-[#E8A4A0]" />
                <span className="tracking-wide">عروض حصرية لفترة محدودة</span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-white leading-tight tracking-tight">
                خصومات كبرى تصل إلى 35% على أطقم البياضات والمفروشات
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/95 leading-relaxed font-normal">
                جددي بيتك بأجود الخامات المصرية الأصيلة. العرض يشمل أطقم السرير، مفروشات الكنب والأنتريه، والبيجامات الحريمي القطنية.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 w-full md:w-auto">
              <Link
                href="/offers"
                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-white text-[#8B1A2E] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl hover:bg-[#FAF7F5] transition-all hover:scale-102 active:scale-95 cursor-pointer"
              >
                <Tag size={19} />
                <span>شاهدي جميع العروض</span>
                <ArrowLeft size={19} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
