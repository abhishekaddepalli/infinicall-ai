"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export const AuthLogo = ({ className, forceLogo }: { className?: string; forceLogo?: string }) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoUrl = useMemo<string | null>(() => {
    if (!mounted) return null;
    if (forceLogo) return forceLogo;
    const isDark = theme === "dark" || resolvedTheme === "dark";
    return isDark ? "/light-logo.png" : "/logo.png";
  }, [mounted, theme, resolvedTheme, forceLogo]);

  return (
    <Link href={ROUTES.DASHBOARD} className={cn("flex items-center gap-3 self-start no-underline", className)}>
      {(!mounted) ? (
        <Skeleton className="h-10 w-40" />
      ) : (
        <Image
          src={logoUrl || "/logo.png"}
          alt="autoCall logo"
          width={120}
          height={48}
          unoptimized
          priority
          style={{ width: "auto", height: "auto" }}
          className="max-h-12 w-auto object-contain transition-all duration-300"
        />
      )}
    </Link>
  );
};
