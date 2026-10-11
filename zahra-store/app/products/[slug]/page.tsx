import React from "react";
import { notFound } from "next/navigation";
import { ProductService } from "@/lib/services/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { getRelatedProducts } from "@/lib/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductService.getBySlug(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود | زهره ستور",
    };
  }

  return {
    title: `${product.name} | زهره ستور`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0]?.url || "/logo.png",
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductService.getBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={related}
    />
  );
}
