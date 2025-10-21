import React from "react";

interface AnimatedOutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "success" | "danger" | "blue" | "custom" ;
}

const AnimatedOutlineButton = ({
  children,
  className = "",
  variant = "default",
  ...rest
}: AnimatedOutlineButtonProps) => {
  
  // Variants - ألوان مختلفة جاهزة
  const variants = {
    default: "bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 hover:from-neutral-600 hover:via-neutral-700 hover:to-neutral-800",
    primary: "bg-gradient-to-br from-chart-3 to-chart-16 hover:from-chart-16 hover:to-chart-3",
    success: "bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700",
    danger: "bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700",
    blue: "bg-gradient-to-r !from-blue-600/20 !to-blue-500/20 !border !border-blue-500/30 text-blue-300",
    custom: "" // للاستخدام الكامل مع className
  };
  
  // Base classes - الأساسيات
  const baseClasses = "group relative inline-flex items-center justify-center text-white font-bold transition-all duration-300 shadow-2xl shadow-black/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:scale-105 hover:-translate-y-1 rounded-lg border border-white/10 hover:border-white/30 overflow-hidden";
  
  // Size classes - الحجم الافتراضي
  const sizeClasses = "px-6 py-3 text-base";
  
  // دمج الـ classes
  const finalClassName = `${baseClasses} ${sizeClasses} ${variant !== "custom" ? variants[variant] : ""} ${className}`.trim();

  return (
    <button
      {...rest}
      className={finalClassName}
    >
      {/* المحتوى */}
      <span className="relative z-10">{children}</span>

      {/* Animated Border Lines - الخطوط المتحركة */}
      
      {/* TOP - الخط العلوي */}
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-white/60 transition-all duration-200 group-hover:w-full" />

      {/* RIGHT - الخط الأيمن */}
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-white/60 transition-all delay-100 duration-200 group-hover:h-full" />

      {/* BOTTOM - الخط السفلي */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white/60 transition-all delay-200 duration-200 group-hover:w-full" />

      {/* LEFT - الخط الأيسر */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-white/60 transition-all delay-300 duration-200 group-hover:h-full" />
    </button>
  );
};

export default AnimatedOutlineButton;
