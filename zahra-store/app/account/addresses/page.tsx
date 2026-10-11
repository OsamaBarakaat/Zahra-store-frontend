"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Plus, ArrowLeft, Home } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="container-zahra py-8 sm:py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE0D4]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A0C08]">
            عناوين التوصيل
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8075] mt-1">
            يتم حفظ عنوانك تلقائياً عند إتمام أي طلب لراحتك وسرعة التوصيل
          </p>
        </div>
        <Link href="/products" className="text-xs sm:text-sm font-bold text-[#8B1A2E] hover:underline">
          تسوق الآن
        </Link>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EDE0D4] text-center">
        <div className="w-14 h-14 rounded-full bg-[#FDF8F5] border border-[#E8A4A0] flex items-center justify-center text-[#8B1A2E] mx-auto mb-3">
          <MapPin size={24} />
        </div>
        <h2 className="text-base font-bold text-[#1A0C08] mb-1">
          العناوين المحفوظة للشحن السريع
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4A42] max-w-md mx-auto mb-6">
          عند إتمام الطلب واختيار &ldquo;حفظ هذه البيانات لتسوق أسرع&rdquo;، سيتم تسجيل عنوانكِ هنا تلقائياً لملء البيانات بضغطة واحدة في المرات القادمة.
        </p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2 h-11 px-6 text-xs sm:text-sm font-bold">
          <span>اكتشفي المنتجات واطلبي الآن</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
}
