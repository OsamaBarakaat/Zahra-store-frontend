import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";

const footerCategories = [
  { href: "/categories/bedding", label: "أطقم بياضات فاخرة" },
  { href: "/categories/home-furnishings", label: "مفروشات منزلية" },
  { href: "/categories/living-room", label: "مفروشات أنتريه وركنة" },
  { href: "/categories/curtains", label: "إسدالات واستقبال" },
  { href: "/categories/headscarves", label: "طرح وأوشحة" },
  { href: "/categories/pajamas", label: "بيجامات حريمي قطن" },
];

const footerLinks = [
  { href: "/products", label: "جميع المنتجات" },
  { href: "/offers", label: "العروض والتخفيضات 🏷️" },
  { href: "/account/orders", label: "تتبع طلبك" },
  { href: "/account/wishlist", label: "قائمة المفضلة" },
  { href: "/account", label: "حسابي" },
];

const supportLinks = [
  { href: "/return-policy", label: "سياسة الاستبدال والاسترجاع" },
  { href: "/shipping-info", label: "مواعيد وأسعار الشحن" },
  { href: "/privacy-policy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "الشروط والأحكام" },
];

const trustFeatures = [
  {
    icon: Truck,
    title: "شحن لجميع المحافظات",
    desc: "توصيل سريع من الإسكندرية لأسوان",
  },
  {
    icon: ShieldCheck,
    title: "معاينة قبل الدفع",
    desc: "تأكدي من الخامة والمقاس أولاً",
  },
  {
    icon: RotateCcw,
    title: "استبدال واسترجاع سهل",
    desc: "ضمان 14 يوم على جميع المشتريات",
  },
  {
    icon: Sparkles,
    title: "قطن مصري أصيل",
    desc: "خامات عالية النعومة والجودة",
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1A0C08] text-white">
      {/* 1. Trust Bar (Modern responsive 4-column cards) */}
      <div className="bg-[#6B1322] border-b border-white/10 py-10 sm:py-12">
        <div className="container-zahra">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {trustFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-[#E8A4A0] flex-shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Multi-Column Layout (Fully responsive) */}
      <div className="py-16 sm:py-20 lg:py-24">
        <div className="container-zahra">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
            {/* Column 1: Brand & Contact Info (Spans 5 cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-block mb-4">
                  <div className="relative w-36 h-16">
                    <Image
                      src="/logo/zahra-logo.png"
                      alt="زهره ستور"
                      fill
                      className="object-contain object-right brightness-0 invert"
                    />
                  </div>
                </Link>
                <p className="text-sm text-white/75 leading-relaxed max-w-sm mb-6">
                  متجركِ المفضل للأناقة والمفروشات المنزلية الراقية في مصر. نقدم أجود الخامات القطنية للبياضات، الكنب، الإسدالات، والطرح بلمسة عصرية تناسب كل بيت مصري.
                </p>

                {/* Direct Hotline Badge */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-sm mb-6 space-y-2">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#E8A4A0]">
                    <Clock size={15} />
                    <span>خدمة العملاء ومتابعة الطلبات:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <a
                      href="tel:+20100000000"
                      className="flex items-center gap-1.5 text-white font-bold hover:text-[#E8A4A0] transition-colors"
                    >
                      <Phone size={14} className="text-[#E8A4A0]" />
                      <span>010 0000 0000</span>
                    </a>
                    <a
                      href="https://wa.me/20100000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 font-bold hover:underline"
                    >
                      <WhatsAppIcon size={15} />
                      <span>واتساب فوري</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Pills */}
              <div>
                <span className="text-xs text-white/60 block mb-2.5">تابعينا على السوشيال ميديا:</span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="إنستجرام"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#8B1A2E] flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                  >
                    <InstagramIcon size={18} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="فيسبوك"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#8B1A2E] flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                  >
                    <FacebookIcon size={18} />
                  </a>
                  <a
                    href="https://wa.me/20100000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="واتساب"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                  >
                    <WhatsAppIcon size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Categories (Spans 3 cols on desktop) */}
            <div className="lg:col-span-3">
              <h3 className="text-base font-bold text-white mb-5 pb-2 border-b border-white/10 inline-block">
                أقسام وتصنيفات المتجر
              </h3>
              <ul className="space-y-3">
                {footerCategories.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="text-xs sm:text-sm text-white/75 hover:text-[#E8A4A0] hover:translate-x-1 transition-all inline-block py-0.5"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Store & Shopping Links (Spans 2 cols on desktop) */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-bold text-white mb-5 pb-2 border-b border-white/10 inline-block">
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/75 hover:text-[#E8A4A0] hover:translate-x-1 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Help, Policies & Guarantees (Spans 2 cols on desktop) */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-bold text-white mb-5 pb-2 border-b border-white/10 inline-block">
                خدمة العملاء
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/75 hover:text-[#E8A4A0] hover:translate-x-1 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-[11px] text-white/50 block">مقر الإدارة:</span>
                <span className="text-xs text-white/80 font-bold block mt-1">القاهرة، جمهورية مصر العربية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar: Copyright & Payment methods (Wrapping cleanly) */}
      <div className="border-t border-white/10 py-6 sm:py-8 bg-black/20">
        <div className="container-zahra">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <p className="text-xs text-white/60">
              جميع الحقوق محفوظة © {new Date().getFullYear()} لمتجر <strong>زهره ستور</strong>. صنع بحب في مصر ❤️
            </p>

            {/* Payment methods badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-white/50 ml-1">طرق الدفع المتاحة:</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold border border-white/10">
                الدفع عند الاستلام (كاش)
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold border border-white/10">
                فودافون كاش والمحافظ الإلكترونية
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                إنستاباي InstaPay (خصم 50% على الشحن)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
