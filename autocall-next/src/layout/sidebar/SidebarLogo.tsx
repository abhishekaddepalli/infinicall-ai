'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import useSettings from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { SidebarLogoProps } from '@/types/shared'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const SidebarLogo = ({ isCollapsed, onClick }: SidebarLogoProps) => {
  const { settings, isLoading } = useSettings();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
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

    if (isCollapsed) {
      const url = settings?.favicon_url || settings?.mobile_logo_url || settings?.sidebar_logo_url;
      return resolveUrl(url) || "/favicon.png";
    }

    const url = isDark 
      ? (settings?.logo_dark_url || settings?.logo_light_url || settings?.sidebar_logo_url || settings?.landing_logo_url || settings?.mobile_logo_url)
      : (settings?.logo_light_url || settings?.logo_dark_url || settings?.sidebar_logo_url || settings?.landing_logo_url || settings?.mobile_logo_url);
    return resolveUrl(url) || (isDark ? "/light-logo.png" : "/logo.png");
  }, [mounted, theme, resolvedTheme, isCollapsed, settings]);

  return (
    <div className={cn(
      "flex items-center h-16 pb-4 border-b border-input-border-color px-4 pt-4 transition-all duration-300",
      isCollapsed ? "justify-center px-0" : "justify-start"
    )}>
      <Link 
        href={ROUTES.DASHBOARD} 
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 no-underline group transition-all duration-300 w-full overflow-hidden",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        {(!mounted || isLoading) ? (
          <Skeleton className={cn("h-10 shrink-0", isCollapsed ? "w-10 rounded-xl" : "w-32")} />
        ) : (
          <Image 
            src={logoUrl || (isCollapsed ? "/favicon.png" : (theme === "dark" ? "/light-logo.png" : "/logo.png"))} 
            alt={settings?.app_name || "autocall logo"} 
            width={isCollapsed ? 40 : 140} 
            height={40} 
            unoptimized 
            className={cn(
              " object-contain",
              isCollapsed ? "w-10" : "w-[170px] h-[70px]"
            )} 
          />
        )}
      </Link>
    </div>
  )
}

export default SidebarLogo
