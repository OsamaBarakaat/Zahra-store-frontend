"use client";
import React from "react";
import { useToastStore } from "@/lib/stores/toastStore";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      role="region"
      aria-label="الإشعارات"
      style={{
        position: "fixed",
        bottom: 24,
        left: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: "min(380px, calc(100vw - 32px))",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        let bg = "bg-white text-zinc-900 border-zinc-200";
        let Icon = Info;
        let iconColor = "#8B1A2E";

        if (toast.type === "success") {
          bg = "bg-[#FDF8F5] text-[#1A0C08] border-[#E8A4A0]";
          Icon = CheckCircle2;
          iconColor = "#16A34A";
        } else if (toast.type === "error") {
          bg = "bg-red-50 text-red-950 border-red-200";
          Icon = AlertCircle;
          iconColor = "#DC2626";
        } else if (toast.type === "warning") {
          bg = "bg-amber-50 text-amber-950 border-amber-200";
          Icon = AlertTriangle;
          iconColor = "#D97706";
        }

        return (
          <div
            key={toast.id}
            role="alert"
            style={{
              pointerEvents: "auto",
              boxShadow: "0 10px 30px rgba(139, 26, 46, 0.12)",
              borderRadius: "14px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderWidth: "1px",
              borderStyle: "solid",
              animation: "fadeInUp 0.25s ease-out",
            }}
            className={`${bg}`}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
              <p style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="إغلاق الإشعار"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9E8075",
                borderRadius: "50%",
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
