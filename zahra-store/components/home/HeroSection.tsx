"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F5] via-[#FFF] to-[#FAF7F5] py-8 sm:py-14 lg:py-20">
      {/* Apple-style Soft Ambient Lighting with subtle floating pulse */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-1/4 w-[480px] h-[480px] bg-[#F2D4CC]/35 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-[#E8A4A0]/25 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container-zahra">
        {/* Main Hero Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden border border-[#EDE0D4] shadow-[0_20px_50px_rgba(139,26,46,0.08)] bg-white"
        >
          <div className="relative w-full aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[420px] sm:min-h-[500px] lg:min-h-[580px]">
            {/* The Brand Cover Image */}
            <Image
              src="/hero-cover.png"
              alt="زهره ستور - مفروشات وبياضات مصرية راقية"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-102 hover:scale-100 transition-transform duration-1000 ease-out"
            />

            {/* Apple-style Editorial Radial/Linear Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/55 sm:to-transparent" />

            {/* Hero Text Box with generous padding & line height */}
            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-12 lg:p-20 text-white z-10 max-w-2xl lg:max-w-3xl">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold w-fit mb-4 sm:mb-6 border border-white/25 shadow-sm"
              >
                <Sparkles size={16} className="text-[#E8A4A0]" />
                <span>تشكيلة الموسم الجديدة وصلت الآن ✨</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.18] sm:leading-[1.15] mb-4 sm:mb-6 text-white drop-shadow-md tracking-tight"
              >
                فخامة ودفء <br />
                <span className="text-[#E8A4A0]">لكل بيت مصري أصيل</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm sm:text-lg lg:text-xl text-white/90 font-medium mb-8 sm:mb-10 max-w-xl leading-relaxed sm:leading-loose"
              >
                أرقى أطقم البياضات القطنية، مفروشات الأنتريه والركنة، الإسدالات، والطرح والبيجامات الحريمي المصممة بأعلى جودة لراحتك وأناقتك.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/products"
                  className="btn-primary h-13 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold shadow-xl shadow-[#8B1A2E]/35 flex items-center gap-2.5 active:scale-95 hover:scale-103 transition-all"
                >
                  <span>تسوقي الآن</span>
                  <ArrowLeft size={19} />
                </Link>

                <Link
                  href="/offers"
                  className="h-13 sm:h-14 px-7 sm:px-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-bold text-sm sm:text-base flex items-center justify-center transition-all hover:scale-102 active:scale-95 shadow-md"
                >
                  <span>تخفيضات وعروض حصرية 🏷️</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 4 Value Pillars Under Hero with Apple-like Spacing & Micro-animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
          {[
            {
              title: "معاينة قبل الدفع",
              desc: "ادفعي بعد ما تشوفي الخامة بنفسك",
              icon: ShieldCheck,
            },
            {
              title: "توصيل لجميع المحافظات",
              desc: "شحن سريع لحد باب بيتك في مصر",
              icon: Truck,
            },
            {
              title: "طرق دفع مرنة وسهلة",
              desc: "كاش أو إنستاباي أو فودافون كاش",
              icon: Sparkles,
            },
            {
              title: "قطن مصري أصيل 100%",
              desc: "خامات ممتازة وناعمة تدوم معكِ",
              icon: RotateCcw,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#EDE0D4] shadow-xs hover:border-[#8B1A2E]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-13 h-13 rounded-2xl bg-[#FDF8F5] border border-[#E8A4A0]/40 flex items-center justify-center text-[#8B1A2E] flex-shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1A0C08] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A645A] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
