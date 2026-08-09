"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import useSettings from "@/hooks/useSettings";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { settings, isLoading } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    const isMaintenanceAffected = user?.role !== "admin" && user?.role !== "super_admin";
    const isMaintenanceMode = settings?.maintenance_mode === true;

    // Check if user's IP is in the allowed whitelist
    const userIp = settings?.userIp;
    const allowedIps = settings?.maintenance_allowed_ips || [];
    const isAllowedIp = userIp && allowedIps.includes(userIp);

    if (isAuthenticated && isMaintenanceAffected && isMaintenanceMode && !isAllowedIp) {
      if (pathname !== "/maintenance") {
        router.replace("/maintenance");
      }
    } else {
      // If maintenance mode is OFF, or user has an admin role, or their IP is allowed:
      // Prevent them from staying on the /maintenance page
      if (pathname === "/maintenance") {
        router.replace("/");
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, settings, pathname, router]);

  return <>{children}</>;
}
