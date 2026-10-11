"use client";
import React from "react";
import { ShieldCheck, Truck, Sparkles, PhoneCall, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyUsSection() {
  const reasons = [
    {
      title: "معاينة الطلب عند الاستلام",
      desc: "تأكدي من خامة ومقاس المنتج بنفسك قبل دفع أي مليم، لراحتك التامة وثقتك الكاملة.",
      icon: ShieldCheck,
    },
    {
      title: "توصيل سريع لكل المحافظات",
      desc: "من الإسكندرية لأسوان، طلبك بيوصل لحد باب بيتك في أسرع وقت مع متابعة مستمرة.",
      icon: Truck,
    },
    {
      title: "قطن مصري 100% يدوم",
      desc: "خامات ممتازة لا تبهت ألوانها ولا تنكمش مع الغسيل، مصنعة خصيصاً لراحتكِ الدائمة.",
      icon: Sparkles,
    },
    {
      title: "خدمة عملاء دايماً معاكي",
      desc: "فريق دعم متاح لمساعدتك في اختيار المقاس المناسب ومتابعة كل تفاصيل شحنتك.",
      icon: PhoneCall,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-y border-[#EDE0D4]/70">
      <div className="container-zahra">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm font-bold text-[#8B1A2E] tracking-wider uppercase block mb-2">
            لماذا تثقين في زهره ستور؟
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A0C08] tracking-tight">
            تسوقي براحة وأمان واطمئنان
          </h2>
          <p className="text-sm sm:text-base text-[#7A645A] mt-3 leading-relaxed">
            نسعى لتقديم تجربة تسوق سهلة وسريعة وموثوقة لكل سيدة مصرية
          </p>
        </div>

        {/* 4 Cards Grid with Framer Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="p-7 sm:p-8 rounded-[28px] bg-[#FAF7F5] border border-[#EDE0D4] hover:border-[#8B1A2E]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] mb-6 shadow-xs">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A0C08] mb-3 leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
                    {r.desc}
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
