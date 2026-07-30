"use client";

import { cn } from "@/lib/utils";
import { FeatureCardProps } from "@/types/shared";

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "sm:p-6 p-4 bg-input-color border border-input-border-color rounded-radius flex gap-5 hover:bg-primary/10 transition-all duration-300 group",
        className
      )}
    >
      <div className="shrink-0 w-12 h-12 rounded-radius bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform duration-300">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-title text-lg group-hover:text-primary leading-tight">{title}</h3>
        <p className="text-subtitle-color text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
