"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  MoveHorizontal,
  ShieldCheck,
  Award,
  Scissors,
  ArrowLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

// Set types and pricing
const SET_OPTIONS = [
  {
    id: "full-salon",
    name: "طقم أنتريه متكامل 6 قطع",
    pieces: "6 قطع",
    description: "مفرش كنبة 3 مقاعد + مفرش كنبة 2 مقعد + 2 مفرش فوتيه + 2 خدادية مطرزة",
    price: 1850,
    originalPrice: 2450,
    popular: true,
  },
  {
    id: "corner-sofa",
    name: "طقم ركنة كبير + 3 خداديات",
    pieces: "5 قطع",
    description: "2 مفرش ركنة مقاس كبير + 3 خداديات مطرزة بالشراشيب",
    price: 1450,
    originalPrice: 1950,
  },
  {
    id: "single-sofa",
    name: "طقم كنبة 3 مقاعد + خدادية",
    pieces: "قطعتين",
    description: "مفرش كنبة كبير (210×90 سم) مطرز + خدادية مطرزة (45×45 سم)",
    price: 650,
    originalPrice: 880,
  },
];

// Key Quality Features
const HIGHLIGHTS = [
  {
    icon: Scissors,
    title: "تطريز نافر بارز ومجسم",
    desc: "أوراق شجر مجسمة بخيوط قطنية ثابتة تدوم طويلاً",
  },
  {
    icon: Award,
    title: "كتان مصري طبيعي فاخر",
    desc: "خامة ثقيلة ناعمة ومقاومة للانزلاق على الأقمشة",
  },
  {
    icon: Sparkles,
    title: "شراشيب مكرامية متقنة",
    desc: "نهايات منسوجة يدوياً تضفي لمسة ملكية فخمة",
  },
  {
    icon: ShieldCheck,
    title: "معاينة مجاناً عند الاستلام",
    desc: "افحصي الجودة والخامة بنفسك قبل دفع أي مليم",
  },
];

export default function BeforeAfterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState<number>(50); // 50% initial
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedSet, setSelectedSet] = useState(SET_OPTIONS[0]);

  // Update slider position based on clientX
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPos(clamped);
  }, []);

  // Pointer drag events for smooth cross-device interaction (mouse & touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      setSliderPos(0);
    } else if (e.key === "End") {
      setSliderPos(100);
    }
  };

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-[#FAF7F5] via-[#FFF] to-[#FAF7F5] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#F2D4CC]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#E8A4A0]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="container-zahra relative z-10">
        {/* ═════════════════════════════════════════════════════════════════════
            1. SECTION HEADER
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1A2E]/10 border border-[#8B1A2E]/20 text-xs sm:text-sm font-bold text-[#8B1A2E] mb-3.5 shadow-xs">
            <Sparkles size={15} className="text-[#8B1A2E]" />
            <span>شوفي الفرق بنفسك - قبل وبعد</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A0C08] tracking-tight leading-tight">
            تحول فوري يجدد صالونك بالكامل
          </h2>
          <p className="text-sm sm:text-base text-[#7A645A] mt-3.5 leading-relaxed">
            اسحبي المؤشر يميناً ويساراً لمشاهدة الفرق المذهل بين الكنبة سادة وبين مظهرها الراقي
            بعد إضافة طقم بياضات ومفارش زهرة ستور المطرزة
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            2. THE INTERACTIVE BEFORE & AFTER SLIDER
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto">
          {/* Main Comparison Card */}
          <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden border-2 border-[#EDE0D4] bg-white shadow-[0_20px_60px_rgba(139,26,46,0.12)]">
            {/* The Image Canvas Stage */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-valuenow={Math.round(sliderPos)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="مقارنة مظهر الكنبة قبل وبعد إضافة المفرش"
              className="relative w-full aspect-[1024/550] overflow-hidden select-none touch-none cursor-ew-resize bg-[#241c19] outline-none focus-visible:ring-4 focus-visible:ring-[#8B1A2E]/40"
            >
              {/* Layer 1 (Base Bottom): "بعد" (After - Sofa WITH Cover) */}
              <img
                src="/images/before-after/sofa-after.jpg"
                alt="الكنبة بعد إضافة مفرش زهرة ستور المطرز"
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />

              {/* Layer 2 (Overlay Top): "قبل" (Before - Plain Sofa WITHOUT Cover) */}
              {/* Clipped from 0% (left) to sliderPos% */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
                  WebkitClipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
                }}
              >
                <img
                  src="/images/before-after/sofa-before.jpg"
                  alt="الكنبة قبل إضافة المفرش - سادة"
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* ── Badges ── */}
              {/* Right Side: "بعد" (After) */}
              <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-20 pointer-events-none flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#8B1A2E]/90 text-white backdrop-blur-md border border-white/20 shadow-lg text-xs sm:text-sm font-black transition-opacity">
                <Sparkles size={14} className="text-[#E8A4A0]" />
                <span>بعد: بمفرش زهرة ستور ✨</span>
              </div>

              {/* Left Side: "قبل" (Before) */}
              <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-20 pointer-events-none flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/65 text-white backdrop-blur-md border border-white/20 shadow-lg text-xs sm:text-sm font-bold transition-opacity">
                <span>قبل: الكنبة سادة</span>
              </div>

              {/* ── Vertical Divider Line ── */}
              <div
                className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.7)] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              />

              {/* ── Center Draggable Handle Knob ── */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white text-[#8B1A2E] shadow-[0_8px_30px_rgba(0,0,0,0.45)] border-3 border-[#8B1A2E] cursor-ew-resize select-none transition-transform hover:scale-110 active:scale-95"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-black">
                  <span className="text-[#8B1A2E]">◄</span>
                  <span className="text-[10px] text-[#8B1A2E]/40 font-normal">|</span>
                  <span className="text-[#8B1A2E]">►</span>
                </div>
              </div>

              {/* Bottom Drag Instruction Hint */}
              <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs text-white/95 font-medium whitespace-nowrap flex items-center gap-2 shadow-lg">
                <MoveHorizontal size={14} className="text-[#E8A4A0]" />
                <span>اسحبي الخط يميناً ويساراً لمشاهدة الفرق</span>
              </div>
            </div>

            {/* Quick Preset Buttons Bar */}
            <div className="bg-[#FAF7F5] px-4 sm:px-6 py-3.5 border-t border-[#EDE0D4] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#7A645A] hidden sm:inline">
                خيارات العرض السريع:
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => setSliderPos(100)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sliderPos >= 98
                      ? "bg-[#1A0C08] text-white shadow-xs"
                      : "bg-white text-[#5C4A42] hover:bg-white/80 border border-[#EDE0D4]"
                  }`}
                >
                  قبل الفرش بالكامل
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPos(50)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sliderPos > 40 && sliderPos < 60
                      ? "bg-[#8B1A2E] text-white shadow-xs"
                      : "bg-white text-[#5C4A42] hover:bg-white/80 border border-[#EDE0D4]"
                  }`}
                >
                  مقارنة النصفين 50/50
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPos(0)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sliderPos <= 2
                      ? "bg-[#8B1A2E] text-white shadow-xs"
                      : "bg-white text-[#5C4A42] hover:bg-white/80 border border-[#EDE0D4]"
                  }`}
                >
                  بعد الفرش بالكامل ✨
                </button>
              </div>

              <div className="text-xs text-[#7A645A] font-semibold hidden md:block">
                مفروش حالياً:{" "}
                <span className="font-black text-[#8B1A2E] tabular-nums">
                  {Math.round(100 - sliderPos)}%
                </span>
              </div>
            </div>
          </div>

          

          {/* ═════════════════════════════════════════════════════════════════
              4. QUALITY FEATURES GRID
             ═════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDE0D4] flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F5] border border-[#EDE0D4] text-[#8B1A2E] flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1A0C08] leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#7A645A] mt-0.5 leading-relaxed hidden sm:block">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
