import React from "react";
import { notFound } from "next/navigation";
import { CategoryService, ProductService } from "@/lib/services/api";
import ProductListContent from "@/components/product/ProductListContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await CategoryService.getBySlug(slug);

  if (!category) {
    return { title: "القسم غير موجود | زهره ستور" };
  }

  return {
    title: `${category.name} | زهره ستور`,
    description: category.description || `تصفحي أحدث منتجات ${category.name} من زهره ستور بأفضل الأسعار وخامات قطن ممتازة.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, allProducts, categories] = await Promise.all([
    CategoryService.getBySlug(slug),
    ProductService.getAll(),
    CategoryService.getAll(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <ProductListContent
      initialProducts={allProducts}
      categories={categories}
      initialCategory={category.slug}
    />
  );
}
