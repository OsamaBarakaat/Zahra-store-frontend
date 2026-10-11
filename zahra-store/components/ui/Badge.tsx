import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sale" | "new" | "out" | "secondary";
  className?: string;
}

export default function Badge({ children, variant = "sale", className = "" }: BadgeProps) {
  let styles = "bg-[#8B1A2E] text-white";

  if (variant === "sale") {
    styles = "bg-[#DC2626] text-white font-bold";
  } else if (variant === "new") {
    styles = "bg-[#8B1A2E] text-white";
  } else if (variant === "out") {
    styles = "bg-zinc-200 text-zinc-700";
  } else if (variant === "secondary") {
    styles = "bg-[#F2D4CC] text-[#8B1A2E] font-semibold";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles} ${className}`}
      style={{ lineHeight: 1.4 }}
    >
      {children}
    </span>
  );
}
