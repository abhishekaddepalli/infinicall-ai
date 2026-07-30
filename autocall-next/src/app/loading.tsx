"use client";

import useSettings from "@/hooks/useSettings";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

export default function Loading() {
  const { settings, isLoading } = useSettings();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoUrl = useMemo<string | null>(() => {
    if (!mounted) return null;
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

    const url = isDark ? settings?.logo_dark_url : settings?.logo_light_url;
    return resolveUrl(url) || (isDark ? "/light-logo.png" : "/logo.png");
  }, [mounted, theme, resolvedTheme, settings]);

  if (!mounted || isLoading) {
    return (
      <div className="fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-rose-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 w-12 h-12 border-b-4 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center bg-background">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-rose-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-10">
        <Image
          src={logoUrl || "/logo.png"}
          alt={settings?.app_name || "autocall logo"}
          width={64}
          height={64}
          unoptimized
          className="max-h-16 w-auto object-contain transition-all duration-300"
        />
      </div>
    </div>
  );
}
