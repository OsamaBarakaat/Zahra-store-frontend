import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryService } from "@/lib/services/api";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "أقسام المتجر | زهره ستور",
  description: "تصفحي جميع أقسام وتصنيفات زهره ستور: بياضات، مفروشات منزلية، إسدالات، طرح، بيجامات حريمي.",
};

export default async function CategoriesPage() {
  const categories = await CategoryService.getAll();

  return (
    <div className="container-zahra py-8 sm:py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-2xl sm:text-4xl font-black text-[#1A0C08]">
          أقسام المتجر
        </h1>
        <p className="text-xs sm:text-sm text-[#9E8075] mt-2">
          اختاري القسم المفضل لديكِ لتصفح أحدث وأجمل التشكيلات
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#EDE0D4] hover:border-[#8B1A2E] hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Category Banner Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 right-4 text-xs font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                {cat.productCount} منتج متوفر
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1A0C08] group-hover:text-[#8B1A2E] transition-colors">
                  {cat.name}
                </h2>
                <p className="text-xs text-[#9E8075] mt-1 line-clamp-1">
                  {cat.description}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#FDF8F5] border border-[#EDE0D4] flex items-center justify-center text-[#8B1A2E] group-hover:bg-[#8B1A2E] group-hover:text-white transition-colors flex-shrink-0">
                <ArrowLeft size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
