"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sortedImages = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    return [...images].sort(
      (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
    );
  }, [images]);

  if (!sortedImages || sortedImages.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-2xl bg-stone-100 overflow-hidden border border-[#EDE0D4]">
        <Image
          src="/logo/zahra-logoo.png"
          alt={productName}
          fill
          className="object-contain p-8"
        />
      </div>
    );
  }

  const currentImage = sortedImages[selectedIndex] || sortedImages[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-50 border border-[#EDE0D4] shadow-sm">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails row (mobile & desktop) */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scroll-x">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`عرض الصورة ${idx + 1}`}
              className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                selectedIndex === idx
                  ? "border-[#8B1A2E] shadow-sm scale-102"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
