import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export const Loader2 = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn("animate-spin rounded-full border-b-[2px] border-current inline-block", className)} 
      {...props} 
    />
  );
};
