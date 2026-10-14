import React from "react";
import { ProductService, CategoryService } from "@/lib/services/api";
import ProductListContent from "@/components/product/ProductListContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "جميع المنتجات | زهره ستور",
  description: "تصفحي جميع منتجات زهره ستور من المفروشات المنزلية، البياضات، الإسدالات، الطرح والبيجامات الحريمي.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    ProductService.getAll(),
    CategoryService.getAll(),
  ]);

  return (
    <ProductListContent
      initialProducts={products}
      categories={categories}
    />
  );
}
