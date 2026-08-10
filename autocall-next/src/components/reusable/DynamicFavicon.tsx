"use client";

import { useEffect } from "react";
import useSettings from "@/hooks/useSettings";
import { getMediaUrl } from "@/utils/auth";
import { usePathname } from "next/navigation";

export default function DynamicFavicon() {
  const { settings } = useSettings();
  const pathname = usePathname();

  useEffect(() => {
    const appTitle = (settings?.app_name && settings.app_name !== "AutoCall" && settings.app_name !== "My Application")
      ? settings.app_name 
      : "InfiniCall AI";

    document.title = appTitle;

    const faviconUrl = settings?.favicon_url || settings?.favicon;
    const resolvedUrl = (faviconUrl && !faviconUrl.includes('autocall')) ? (getMediaUrl(faviconUrl) || "/favicon.png") : "/favicon.png";

    // Helper to set link elements
    const setFavicon = (href: string) => {
      // Handle standard icon
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = href;

      // Handle apple-touch-icon
      let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (!appleLink) {
        appleLink = document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        document.getElementsByTagName("head")[0].appendChild(appleLink);
      }
      appleLink.href = href;

      // Handle shortcut icon
      let shortcutLink = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
      if (!shortcutLink) {
        shortcutLink = document.createElement("link");
        shortcutLink.rel = "shortcut icon";
        document.getElementsByTagName("head")[0].appendChild(shortcutLink);
      }
      shortcutLink.href = href;
    };

    setFavicon(resolvedUrl);
  }, [settings, pathname]);

  return null;
}
