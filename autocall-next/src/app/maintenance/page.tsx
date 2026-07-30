"use client";

import Spinner from '@/components/reusable/Spinner';
import { Button } from "@/components/ui/button";
import useSettings from "@/hooks/useSettings";
import { baseApi } from "@/redux/api/baseApi";
import { useAppDispatch } from "@/redux/hooks";
import { clearAuth } from "@/redux/slices/authSlice";
import { authUtils, getMediaUrl } from "@/utils/auth";
import { LogOut, Wrench } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function MaintenancePage() {
  const router = useRouter();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const { settings, isLoading } = useSettings();

  const handleBackToLogin = () => {
    // Clear cookies & localStorage
    authUtils.clearAuth();
    // Clear Redux state
    dispatch(clearAuth());
    // Reset API state cache
    dispatch(baseApi.util.resetApiState());
    // Redirect to login
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 ">
        <Spinner />
      </div>
    );
  }

  const appName = settings?.app_name || "AutoCall";
  const title = settings?.maintenance_title || "System Under Maintenance";
  const message =
    settings?.maintenance_message ||
    "We are currently performing scheduled maintenance to improve our services. Please check back shortly.";
  const imageUrl = settings?.maintenance_image_url
    ? getMediaUrl(settings.maintenance_image_url)
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-slate-50  px-6 py-12">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-white border border-slate-200/60 dark:border-white/5 shadow-2xl rounded-3xl p-8 md:p-12 text-center">
          {/* Top Brand Logo / Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transition-all duration-700 group-hover:bg-primary/40 group-hover:blur-2xl" />
              <div className="relative w-24 h-24 bg-slate-50 dark:bg-card border border-slate-200/50 dark:border-white/5 rounded-3xl flex items-center justify-center transform transition-all duration-500 hover:rotate-12 hover:scale-110 shadow-lg">
                <Wrench className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Maintenance Custom Image if provided */}
          {imageUrl && (
            <div className="flex justify-center mb-8 max-w-sm mx-auto">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/5">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Maintenance Text info */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {title}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            {message}
          </p>

          {/* Back to Login Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleBackToLogin}
              className="group flex items-center gap-2 px-8 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/45 hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              {t('back_to_login')}
            </Button>
          </div>
        </div>

        {/* Footer copyright */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
          © {new Date().getFullYear()} {appName} AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
