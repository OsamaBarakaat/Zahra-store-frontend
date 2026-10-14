import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastContainer from "@/components/ui/ToastContainer";
import SearchModal from "@/components/search/SearchModal";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "زهره ستور | مفروشات وأزياء نسائية",
    template: "%s | زهره ستور",
  },
  description:
    "زهره ستور — متجرك المفضل للمفروشات المنزلية والأزياء النسائية في مصر. بياضات، إسدالات، طرح، بيجامات حريمي بأفضل الأسعار.",
  keywords: [
    "زهره ستور",
    "مفروشات منزلية",
    "بياضات",
    "إسدالات",
    "طرح",
    "بيجامات حريمي",
    "تسوق اون لاين مصر",
  ],
  authors: [{ name: "زهره ستور" }],
  creator: "زهره ستور",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "زهره ستور",
    title: "زهره ستور | مفروشات وأزياء نسائية",
    description:
      "متجرك المفضل للمفروشات المنزلية والأزياء النسائية في مصر",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { CategoryService, ProductService } from "@/lib/services/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, featured] = await Promise.all([
    CategoryService.getAll(),
    ProductService.getFeatured(),
  ]);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#8B1A2E" />
      </head>
      <body>
        <Header initialCategories={categories} initialFeatured={featured} />
        <main className="pt-header min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <ToastContainer />
      </body>
    </html>
  );
}
