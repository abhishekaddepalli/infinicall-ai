"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/utils/auth";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export const AuthLogo = ({
  className,
  forceLogo,
  logoType = "auth",
}: {
  className?: string;
  forceLogo?: string;
  logoType?: "landing" | "onboarding" | "auth";
}) => {
  const { settings, isLoading } = useSettings();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoUrl = useMemo<string | null>(() => {
    if (!mounted) return null;
    if (forceLogo) return getMediaUrl(forceLogo) || forceLogo;

    const isDark = theme === "dark" || resolvedTheme === "dark";

    let settingUrl = "";
    if (logoType === "landing") {
      settingUrl = settings?.landing_logo_url || settings?.logo_light_url || settings?.logo_dark_url || settings?.sidebar_logo_url || settings?.mobile_logo_url;
    } else if (logoType === "onboarding") {
      settingUrl = settings?.onboarding_logo_url || settings?.landing_logo_url || settings?.logo_light_url || settings?.sidebar_logo_url;
    } else {
      settingUrl = isDark
        ? (settings?.logo_dark_url || settings?.logo_light_url || settings?.landing_logo_url || settings?.sidebar_logo_url || settings?.mobile_logo_url)
        : (settings?.logo_light_url || settings?.logo_dark_url || settings?.landing_logo_url || settings?.sidebar_logo_url || settings?.mobile_logo_url);
    }

    if (settingUrl) {
      const resolved = getMediaUrl(settingUrl);
      if (resolved) return resolved;
    }

    return isDark ? "/light-logo.png" : "/logo.png";
  }, [mounted, theme, resolvedTheme, forceLogo, logoType, settings]);

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
