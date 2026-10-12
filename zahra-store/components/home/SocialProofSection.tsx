"use client";
import React from "react";
import { Star, Heart, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { motion } from "framer-motion";

export default function SocialProofSection() {
  const reviews = [
    {
      name: "مروة عبد الرحمن (القاهرة)",
      text: "طقم البياضات وصلني اليوم وخامته قطن مصري تحفة بجد! واللون بالظبط زي الصور. شكراً لسرعة التوصيل وذوق المندوب.",
      rating: 5,
      product: "طقم بياضات زهور الورد",
    },
    {
      name: "سارة كمال (الإسكندرية)",
      text: "البيجاما الحرير خامتها ناعمة جداً ومريحة ومقاسها مظبوط بالمللي. أكيد هطلب ألوان تانية قريباً.",
      rating: 5,
      product: "بيجاما حرير ورد ناعمة",
    },
    {
      name: "أم يوسف (الجيزة)",
      text: "غطاء الكنبة والستارة غيروا شكل الصالة 180 درجة! جودة ممتازة وسعر أرخص بكتير من المحلات برا.",
      rating: 5,
      product: "غطاء كنبة بريميوم مطاطي",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F5]">
      <div className="container-zahra">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8B1A2E] mb-3">
            <Heart size={16} className="fill-[#8B1A2E]" />
            <span>آراء وتجارب عميلاتنا</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A0C08] tracking-tight">
            ثقتكم هي سر تميزنا
          </h2>
          <p className="text-sm sm:text-base text-[#7A645A] mt-3">
            أكثر من 5,000 سيدة مصرية وثقت بمنتجاتنا في كل المحافظات
          </p>
        </div>

        {/* Customer Reviews Cards Grid with Framer Motion Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-16">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="p-8 sm:p-10 rounded-[30px] bg-white border border-[#EDE0D4] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>عميلة موثقة</span>
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#1A0C08] leading-relaxed mb-6 font-medium">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#F5EDE6]">
                <p className="text-sm font-bold text-[#8B1A2E]">{rev.name}</p>
                <p className="text-xs text-[#9E8075] mt-0.5">منتج: {rev.product}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#EDE0D4] max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs"
        >
          <div className="flex items-center gap-4 text-right">
            <div className="w-14 h-14 rounded-2xl bg-[#F2D4CC] text-[#8B1A2E] flex items-center justify-center flex-shrink-0">
              <InstagramIcon size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A0C08]">تابعينا على إنستجرام</h3>
              <p className="text-xs sm:text-sm text-[#7A645A] mt-0.5">
                شاهدي صور وفيديوهات منتجاتنا على الطبيعة يومياً
              </p>
            </div>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs sm:text-sm font-bold h-12 px-6 flex-shrink-0 hover:scale-102 cursor-pointer"
          >
            متابعة الحساب
          </a>
        </motion.div>
      </div>
    </section>
  );
}
