"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SocialButtonProps } from "@/types/shared";

const SocialButton = ({ icon, label, onClick, className }: SocialButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-3 w-full px-4 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium text-gray-900 dark:text-white",
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default SocialButton;
