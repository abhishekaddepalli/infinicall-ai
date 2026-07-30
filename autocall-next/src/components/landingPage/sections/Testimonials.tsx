"use client";

import { TestimonialsProps } from "@/types/landing";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Testimonials({ testimonialSection, testimonialsData }: TestimonialsProps) {
  const { t } = useTranslation();
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderCard = (t: any, index: number) => (
    <div key={`${t.user_name}-${index}`} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:border-white/20 transition-all duration-300 relative group">
      <div className="flex items-center gap-0.5 text-amber-500 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>

      <p className="text-[14px] text-slate-200 leading-relaxed mb-6 font-medium line-clamp-4">&quot;{t.description}&quot;</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary/10">{getInitials(t.user_name)}</div>
        <div>
          <h4 className="text-[14px] font-bold text-white leading-tight break-all whitespace-normal line-clamp-1">{t.user_name}</h4>
          <p className="text-[12px] text-slate-300 mt-0.5 break-all whitespace-normal line-clamp-4">{t.user_post}</p>
        </div>
      </div>
    </div>
  );

  const repeatArray = (arr: any[], times: number) => Array.from({ length: times }).flatMap(() => arr);
  const col1 = testimonialsData.filter((_, i) => i % 3 === 0);
  const col2 = testimonialsData.filter((_, i) => i % 3 === 1);
  const col3 = testimonialsData.filter((_, i) => i % 3 === 2);

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-[#001a2e] via-[#012d46] to-[#013d5e] overflow-hidden" id="testimonials">
      {/* Immersive background box grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] h-[-webkit-fill-available] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-[-webkit-fill-available] gap-[calc(25px+(48-25)*((100vw-320px)/(1920-320)))] items-center">
          {/* Left Side Header */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            <h2 className="text-[calc(26px+(42-26)*((100vw-320px)/(1920-320)))] font-extrabold text-white tracking-tight leading-[1.15] mb-[calc(16px+(24-16)*((100vw-320px)/(1920-320)))]">{testimonialSection.section_heading}</h2>

            <p className="text-base text-slate-400 leading-relaxed mb-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))]">{testimonialSection.section_subheading || "Explore how AutoCall empowers modern founders to turn raw customer databases into actionable, high-conversion AI-driven voice campaigns."}</p>

          </div>

          {/* Right Side Cards Column Grid */}
          {testimonialsData.length === 0 ? (
            <div className="lg:col-span-7 flex flex-col items-center justify-center py-16 px-6 bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl text-center w-full shadow-sm">
              <div className="w-14 h-14 mb-4 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Quote className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('no_testimonials_found')}</h3>
              <p className="text-slate-300 text-sm max-w-sm">{t('there_are_currently_no_customer_stories_available_to_display')}</p>
            </div>
          ) : (
            <div className="lg:col-span-7 h-[600px] overflow-hidden relative">
              {/* Fade out masks for smooth scrolling illusion */}

              {/* Mobile View - 1 Column */}
              <div className="grid grid-cols-1 gap-6 h-full sm:hidden p-4">
                <div className="space-y-6 animate-marquee-up hover:[animation-play-state:paused]">{repeatArray(testimonialsData, 4).map((t, index) => renderCard(t, index))}</div>
              </div>

              {/* Desktop View - 3 Columns */}
              <div className="hidden sm:grid grid-cols-3 gap-6 h-full p-6">
                {/* Column 1 */}
                <div className="space-y-6 animate-marquee-up hover:[animation-play-state:paused]">{repeatArray(col1, 4).map((t, index) => renderCard(t, index))}</div>

                {/* Column 2 - reverse animation */}
                <div className="space-y-6 animate-marquee-down hover:[animation-play-state:paused]">{repeatArray(col2, 4).map((t, index) => renderCard(t, index))}</div>

                {/* Column 3 */}
                <div className="space-y-6 animate-marquee-up hover:[animation-play-state:paused]">{repeatArray(col3, 4).map((t, index) => renderCard(t, index))}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
