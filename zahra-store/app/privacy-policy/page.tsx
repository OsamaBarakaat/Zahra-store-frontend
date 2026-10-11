import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "سياسة الخصوصية | زهره ستور",
  description: "سياسة الخصوصية وحماية بيانات العملاء في متجر زهره ستور.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-zahra py-10 sm:py-14 max-w-3xl">
      <div className="p-8 rounded-3xl bg-white border border-[#EDE0D4] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EDE0D4]">
          <div className="w-12 h-12 rounded-xl bg-[#FDF8F5] border border-[#E8A4A0] text-[#8B1A2E] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A0C08]">
              سياسة الخصوصية وأمان البيانات
            </h1>
            <p className="text-xs text-[#9E8075] mt-0.5">
              حرصنا التام على حماية خصوصيتك وبياناتك الشخصية
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
          <p>
            نحن في <strong>زهره ستور</strong> نلتزم بأعلى معايير حماية وخصوصية بيانات عملائنا في جمهورية مصر العربية.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] pt-2">
            1. ما هي البيانات التي نجمعها؟
          </h2>
          <p>
            نجمع فقط البيانات الضرورية لتوصيل طلباتك بنجاح، والتي تشمل: الاسم، رقم الهاتف للتواصل، عنوان الشحن بالتفصيل، والبريد الإلكتروني في حال رغبتك.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] pt-2">
            2. كيف نستخدم بياناتك؟
          </h2>
          <p>
            تُستخدم بياناتك فقط لتجهيز وتوصيل الشحنة، وإرسال تحديثات حالة الطلب عبر الهاتف أو الواتساب، والرد على استفساراتك عبر خدمة العملاء. لا نقوم إطلاقاً ببيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض دعائية.
          </p>

          <h2 className="text-sm sm:text-base font-bold text-[#1A0C08] pt-2">
            3. أمان المعاملات المالية
          </h2>
          <p>
            جميع طرق الدفع المتاحة (الدفع عند الاستلام، إنستاباي، فودافون كاش) تتم بأعلى معايير الأمان والتشفير وبشكل مباشر دون تخزين أي أرقام سرية أو بيانات بنكية حساسة.
          </p>
        </div>

        <div className="pt-4 border-t border-[#EDE0D4]">
          <Link href="/products" className="text-xs font-bold text-[#8B1A2E] hover:underline">
            العودة للتسوق في زهره ستور
          </Link>
        </div>
      </div>
    </div>
  );
}
