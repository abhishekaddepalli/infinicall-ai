"use client";

import { getImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function Comparison({ comparisonData }: { comparisonData?: any }) {
  const { t } = useTranslation();
  const features = comparisonData?.features || [];
  const traditional = comparisonData?.traditional || [];
  const aiAgents = comparisonData?.aiAgents || [];
  const robotImage =
    comparisonData?.robotImage && comparisonData?.robotImage !== ""
      ? getImageUrl(comparisonData?.robotImage)
      : "/assets/images/robot1.png";

  return (
    <section
      className="relative py-[calc(40px+(96-40)*((100vw-320px)/(1920-320)))] bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] overflow-hidden"
      id="comparison"
    >
      {/* Line Grid Background (same as Integrations section) */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern" />

      {/* Ambient Glows */}
      <div className="absolute top-[10%] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(1,84,130,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-8 relative">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-[480px] relative z-10"
          >
            <h2 className="text-[calc(28px+(46-28)*((100vw-320px)/(1920-320)))] font-extrabold text-[#015482] tracking-tight leading-[1.2] mb-8">
              {comparisonData?.heading || t('turn_every_call_into_an_opportunity_with_ai')}
            </h2>
            <ul className="pl-5 space-y-4 w-full">
              {features.map((feature: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-title font-medium text-[15px] sm:text-[16px]"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Center Robot Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden xl:flex flex-col absolute left-[75%] top-12 w-[350px] 2xl:w-[400px] z-0"
            >
              <Image
                src={robotImage}
                alt="robot"
                width={500}
                height={450}
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
                unoptimized
              />
            </motion.div>
          </motion.div>

          {/* Right Comparison Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 w-full max-w-[650px] flex flex-col z-10"
          >
            {/* Headers outside the box */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-4 px-4 sm:px-6">
              <h3 className="font-bold text-title text-base sm:text-lg">
                {t('traditional_call_centers')}
              </h3>
              <h3 className="font-bold text-primary text-base sm:text-lg">
                {t('auto_call_ai_voice_agent')}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative">
              <div className="grid grid-cols-2 gap-4 sm:gap-8 h-full">
                {/* Traditional */}
                <div className="flex flex-col">
                  <ul className="space-y-5">
                    {traditional.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm sm:text-[15px] text-slate-600"
                      >
                        <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-red-500 stroke-[3]" />
                        </div>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Agents */}
                <div className="flex flex-col">
                  <ul className="space-y-5">
                    {aiAgents.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm sm:text-[15px] text-slate-700 font-medium"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                        </div>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
