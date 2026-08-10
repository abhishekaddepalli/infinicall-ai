"use client";

import { Button } from "@/components/ui/button";
import { PricingProps } from "@/types/landing";
import { Check, Crown, Gem, Gift, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export function Pricing({ pricingSection, plansData }: PricingProps) {
  const { t } = useTranslation();
  const [isAnnual] = useState(false);

  const getPlanIcon = (name: string, index: number) => {
    const nameLower = name?.toLowerCase() || '';
    if (nameLower.includes('basic') || nameLower.includes('free') || index === 0) {
      return <Gift className="w-6 h-6 text-primary" />;
    }
    if (nameLower.includes('premium') || nameLower.includes('pro') || index === 1) {
      return <Crown className="w-6 h-6 text-amber-500" />;
    }
    if (nameLower.includes('enterprise') || nameLower.includes('ultimate') || index === 2) {
      return <Gem className="w-6 h-6 text-violet-500" />;
    }
    return <Sparkles className="w-6 h-6 text-primary" />;
  };

  return (
    <section className="relative py-[calc(40px+(96-40)*((100vw-320px)/(1920-320)))] bg-transparent border-t border-[#e2e8f0]/80 overflow-hidden" id="pricing">
      {/* Immersive background dotted grid pattern */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-0 bg-dot-pattern" />

      {/* Vibrant Ambient Radial Glows */}
      <div className="absolute top-[30%] left-[-150px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-150px] w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(1,84,130,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-[calc(22px+(46-22)*((100vw-320px)/(1920-320)))] font-extrabold text-title tracking-tight leading-[1.1] max-w-3xl mx-auto mb-4">{pricingSection.title}</h2>

          <p className="text-[calc(15px+(18-15)*((100vw-320px)/(1920-320)))] text-subtitle-color max-w-xl mx-auto leading-relaxed">{pricingSection.description || "Choose the plan that fits your call volume. Get started in minutes, upgrade or cancel anytime."}</p>
        </div>

        {plansData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-[#e2e8f0] rounded-2xl max-w-xl mx-auto text-center w-full shadow-sm">
            <div className="w-14 h-14 mb-4 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-title mb-2">{t('no_plans_found')}</h3>
            <p className="text-subtitle-color text-md max-w-sm">{t('there_are_currently_no_pricing_plans_available_to_display')}</p>
          </div>
        ) : (
          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pricing-swiper !pb-16 !pt-8 px-4 -mx-4"
            >
              {plansData.map((plan, index) => {
                const isPro = plan.is_popular;
                const amount = plan.amount;
                const displayAmount = isAnnual ? Math.round(amount * 0.8) : amount;

                const fallbackFeatures = index === 0 ? ["2 Active Phone Numbers", "500 calling minutes / month", "2 Voice Agent Slots", "Standard FAQ Knowledge Sync"] : index === 1 ? ["10 Active Phone Numbers", "2,500 calling minutes / month", "10 Voice Agent Slots", "Unlimited FAQ & Document Sync", "API Credentials & Webhooks"] : ["Unlimited Phone Numbers", "Custom Calling Volume Packages", "Dedicated Agent Clusters", "24/7 Telephone Carrier SLA", "On-Premise / Custom DB Integrations"];

                const renderFeatures = () => {
                  let itemsList: string[] = [];

                  if (plan.features && Object.keys(plan.features).length > 0) {
                    itemsList = Object.entries(plan.features).map(([key, value]) => `${value} ${key}`);
                  } else {
                    const limits = [
                      { val: plan.agent_limit, label: "AI Assistant Limit" },
                      { val: plan.campaign_limit_per_day, label: "Campaign Limit Per Day" },
                      { val: plan.flow_limit, label: "Workflow Limit" },
                      { val: plan.knowledgebase_limit, label: "Knowledgebase Limit" },
                      { val: plan.storage_limit, label: "Storage Limit (MB)" },
                      { val: plan.contact_limit, label: "Contact Limit" },
                      { val: plan.sms_agent_limit, label: "SMS Assistant Limit" },
                      { val: plan.sms_campaign_limit_per_day, label: "SMS Campaign Limit Per Day" },
                      { val: plan.campaign_sms_limit, label: "SMS Limit Per Campaign" }
                    ].filter((item) => item.val !== undefined && item.val !== null);

                    if (limits.length > 0) {
                      itemsList = limits.map((item) => `${item.label} : ${item.val === -1 ? "Unlimited" : item.val}`);
                    } else {
                      itemsList = fallbackFeatures;
                    }
                  }

                  return itemsList.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-[14px] text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                      <span className="font-semibold text-slate-800 break-all whitespace-normal line-clamp-1">{feat}</span>
                    </li>
                  ));
                };

                const ctaText = "Get Started";

                return (
                  <SwiperSlide key={plan.slug || index} className="!h-auto flex">
                    <div
                      className={`relative flex flex-col justify-between rounded-3xl sm:p-6 p-4 transition-all duration-500 w-full text-left bg-white border 
                      ${isPro ? "border-primary shadow-[0_20px_50px_rgba(1,84,130,0.12)] -translate-y-2 relative" : "border-[#e2e8f0] hover:border-primary/30 shadow-sm hover:shadow-md"}`}
                    >
                      {isPro && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                          <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm">{t('most_popular')}</span>
                        </div>
                      )}

                      <div>
                        {/* Header: Icon & Tier Tag */}
                        <div className="mb-6 flex items-center justify-between">
                          <div
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center bg-primary/5 
                        ${isPro ? "border-primary/20 bg-primary/10" : "border-[#e2e8f0]"}`}
                          >
                            {getPlanIcon(plan.name, index)}
                          </div>
                        </div>

                        {/* Tier Title & Description */}
                        <div className="mb-5">
                          <h3 className="text-2xl font-bold text-title tracking-tight">{plan.name}</h3>
                          <p className="text-sm text-subtitle-color mt-1.5 leading-relaxed break-all whitespace-normal line-clamp-2">{plan.description || "Unlock advanced voice automation to accelerate growth."}</p>
                        </div>

                        {/* Pricing Display */}
                        <div className="mb-6 flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-title tracking-tight">{plan.slug.includes("enterprise") ? "Custom" : `₹${displayAmount}`}</span>
                          {!plan.slug.includes("enterprise") && <span className="text-[13px] font-semibold text-subtitle-color">/ month</span>}
                        </div>

                        {/* Features Header Divider */}
                        <div className="mb-6">
                          <div className="w-full h-px bg-slate-100 mt-3" />
                        </div>

                        {/* Features List */}
                        <ul className="space-y-4 mb-8">{renderFeatures()}</ul>
                      </div>

                      {/* CTA Action Button */}
                      <div className="mt-auto">
                        {plan.slug.includes("enterprise") ? (
                          <Link
                            href="#contact"
                            className={`w-full flex items-center justify-center h-12 rounded-radius p-padding font-bold text-sm transition-all duration-300 border 
                          ${isPro ? "bg-primary text-white shadow-md" : "bg-primary/10 hover:text-white text-primary hover:bg-primary"}`}
                          >
                            {ctaText}
                          </Link>
                        ) : (
                          <Button
                            className={`w-full h-12 rounded-radius p-padding font-bold text-sm transition-all duration-300 flex items-center justify-center 
                          ${isPro ? "bg-primary text-white" : "bg-primary/10 hover:text-white text-primary hover:bg-primary"}`}
                          >
                            {ctaText}
                          </Button>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
