"use client";

import { cn } from "@/lib/utils";
import { GlassPanelProps } from "@/types/shared";

const GlassPanel = ({ children, className, variant = "default" }: GlassPanelProps) => {
  const variants = {
    default: "bg-background/50 backdrop-blur-md border border-border/50",
    glass: "bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl",
    premium: "bg-gradient-to-br from-gray-100/10 dark:from-white/10 to-transparent backdrop-blur-2xl border border-gray-300 dark:border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)]",
  };

  return (
    <div className={cn("rounded-2xl", variants[variant], className)}>
      {children}
    </div>
  );
};

export default GlassPanel;
