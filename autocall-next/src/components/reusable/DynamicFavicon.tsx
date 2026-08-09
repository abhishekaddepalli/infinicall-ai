"use client";

import { useEffect } from "react";
import useSettings from "@/hooks/useSettings";
import { getMediaUrl } from "@/utils/auth";

export default function DynamicFavicon() {
  const { settings } = useSettings();

  useEffect(() => {
    const faviconUrl = settings?.favicon_url || settings?.favicon;
    const resolvedUrl = faviconUrl ? getMediaUrl(faviconUrl) : "/favicon.png";

    if (!resolvedUrl) return;

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
  }, [settings]);

  return null;
}
