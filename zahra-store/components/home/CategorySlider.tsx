"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <section className="py-16 sm:py-24 border-b border-[#EDE0D4]/70 bg-[#FAF7F5]">
      <div className="container-zahra">
        {/* Section Header with generous Apple-style margins */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8B1A2E] mb-2 uppercase tracking-wider">
              <Sparkles size={15} />
              <span>أقسام وتصنيفات المتجر</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1A0C08] tracking-tight">
              تسوقي حسب القسم
            </h2>
            <p className="text-sm sm:text-base text-[#7A645A] mt-2 max-w-xl">
              تشكيلات متكاملة مختارة بعناية لتناسب كل ركن في بيتك وتبرز جمال أناقتك
            </p>
          </div>

          <Link
            href="/categories"
            className="btn-outline h-11 px-5 text-xs sm:text-sm font-bold flex items-center gap-2 self-start sm:self-auto hover:scale-102"
          >
            <span>استعراض جميع الأقسام</span>
            <ArrowLeft size={16} />
          </Link>
        </div>

        {/* Spacious Grid of Categories with Framer Motion Stagger */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center text-center p-5 sm:p-6 rounded-[26px] bg-white border border-[#EDE0D4] hover:border-[#8B1A2E]/50 shadow-xs hover:shadow-xl transition-all duration-300 h-full justify-between"
              >
                {/* Category Image Circle */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 bg-stone-100 border-2 border-[#F2D4CC] group-hover:border-[#8B1A2E] group-hover:shadow-md transition-all duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Title */}
                <span className="text-sm sm:text-base font-bold text-[#1A0C08] group-hover:text-[#8B1A2E] transition-colors leading-snug line-clamp-1 mb-1">
                  {cat.name}
                </span>

                {/* Count */}
                <span className="text-xs text-[#9E8075] font-medium bg-[#FAF7F5] px-2.5 py-0.5 rounded-full border border-[#EDE0D4]/60">
                  {cat.productCount} منتج
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
