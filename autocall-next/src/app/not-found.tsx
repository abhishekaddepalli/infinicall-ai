"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useGetPublicSettingsQuery } from "@/redux/api/adminSettingApi";
import { ArrowLeft, Home, FileQuestion, SearchAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: settingsResponse } = useGetPublicSettingsQuery(undefined);
  const settings = settingsResponse?.data || {};

  const title = settings.page_404_title || "Lost in space";
  const content = settings.page_404_content || "We couldn't find the page you're looking for. It might have been moved or doesn't exist.";

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-[#fafcff] dark:bg-[#05131D]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-sky-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 dark:bg-teal-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-primary/5 dark:bg-purple-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Left Dot Grid */}
      <div className="absolute left-10 md:left-24 top-1/4 hidden lg:grid grid-cols-4 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={`l-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary/20 dark:bg-sky-500/20" />
        ))}
      </div>

      {/* Right Dot Grid */}
      <div className="absolute right-10 md:right-24 bottom-1/4 hidden lg:grid grid-cols-4 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={`r-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary/20 dark:bg-sky-500/20" />
        ))}
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-[20%] left-[30%] w-6 h-6 border-2 border-primary/20 dark:border-sky-500/30 rounded-full hidden md:block" />
      <div className="absolute top-[25%] right-[25%] w-12 h-12 border-2 border-primary/10 dark:border-sky-500/20 rounded-full hidden md:block" />
      <div className="absolute bottom-[15%] left-[25%] w-4 h-4 border-2 border-primary/20 dark:border-sky-500/30 rounded-full hidden md:block" />
      <div className="absolute bottom-[20%] right-[35%] w-3 h-3 border border-primary/20 dark:border-sky-500/30 rounded-full hidden md:block" />

      {/* Tiny solid dots */}
      <div className="absolute top-[15%] left-[45%] w-1.5 h-1.5 bg-primary/30 dark:bg-sky-400/40 rounded-full hidden md:block" />
      <div className="absolute bottom-[30%] left-[15%] w-2 h-2 bg-primary/40 dark:bg-sky-400/50 rounded-full hidden md:block" />
      <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-primary/30 dark:bg-sky-400/40 rounded-full hidden md:block" />

      {/* Scrollable Content Container */}
      <div className="absolute inset-0 w-full h-full overflow-x-hidden no-scrollbar overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center py-12 sm:px-6 px-4">
          <div className="relative z-10 max-w-4xl w-full">
            <div className="text-center sm:p-4 p-0 md:p-16">

              {/* Main Graphic */}
              <div className="flex justify-center mb-12 mt-4 relative">
                <div className="relative group cursor-pointer w-36 h-36">
                  {/* Outer Glow */}
                  <div className="absolute inset-0 bg-primary/20 dark:bg-sky-500/20 blur-3xl rounded-full transition-all duration-700 group-hover:bg-primary/40 dark:group-hover:bg-sky-500/40 group-hover:blur-3xl animate-pulse" />

                  {/* Animated decorative rings */}
                  <div className="absolute inset-[-25%] border-[1.5px] border-primary/20 dark:border-sky-500/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-[-50%] border border-primary/10 dark:border-sky-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                  {/* Glassmorphic Container */}
                  <div className="absolute inset-0 bg-bg-card/70 backdrop-blur-xl border border-input-border-color rounded-full flex items-center justify-center overflow-hidden">
                    {/* Inner shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/40 to-transparent dark:via-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full" />

                    <FileQuestion className="w-16 h-16 text-primary dark:text-sky-400 drop-shadow-sm" strokeWidth={1.5} />
                  </div>

                  {/* Floating mini icon */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-md" style={{ animationDuration: '3s' }}>
                    <SearchAlert className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>
                </div>
              </div>

              <h1 className="text-[120px] md:text-[180px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-primary/20 drop-shadow-sm mb-4 select-none">
                404
              </h1>

              <h2 className="text-3xl md:text-5xl font-extrabold text-title mb-6 tracking-tight">
                {title}
              </h2>

              <p className="text-lg md:text-xl text-subtitle-color max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                {content}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="group flex items-center gap-3 p-padding! h-11 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-base border-none w-full sm:w-auto"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  {t('go_back')}
                </Button>
                <Button
                  onClick={() => router.push(ROUTES.DASHBOARD || '/')}
                  className="group flex items-center gap-3 p-padding! h-11 rounded-lg bg-primary text-white font-bold text-base w-full sm:w-auto"
                >
                  <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {t('go_to_homepage')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
