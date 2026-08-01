"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export const AuthLogo = ({ className, forceLogo }: { className?: string; forceLogo?: string }) => {
  const { settings, isLoading } = useSettings();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoUrl = useMemo<string | null>(() => {
    if (!mounted) return null;
    if (forceLogo) return forceLogo;

    const isDark = theme === "dark" || resolvedTheme === "dark";
    const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

    const resolveUrl = (url?: string) => {
      if (!url || typeof url !== "string") return "";
      if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
      }
      const baseUrl = API_URL.replace(/\/$/, "");
      const path = url.startsWith("/") ? url : `/${url}`;
      return `${baseUrl}${path}`;
    };

    const customLogo = settings?.landing_logo_url || (isDark ? settings?.logo_dark_url : settings?.logo_light_url);
    if (customLogo) {
      const resolved = resolveUrl(customLogo);
      if (resolved) return resolved;
    }

    return isDark ? "/light-logo.png" : "/logo.png";
  }, [mounted, theme, resolvedTheme, forceLogo, settings]);

  return (
    <Link href={ROUTES.DASHBOARD} className={cn("flex items-center gap-3 self-start no-underline", className)}>
      {(!mounted || isLoading) ? (
        <Skeleton className="h-10 w-40" />
      ) : (
        <Image
          src={logoUrl || "/logo.png"}
          alt={settings?.app_name || "autoCall logo"}
          width={140}
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
