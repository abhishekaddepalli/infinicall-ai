"use client";

import { Button } from "@/components/ui/button";
import { FaqsProps } from "@/types/landing";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Faqs({ faqSection, faqsData }: FaqsProps) {
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const renderFaqItem = (faq: any, index: number) => {
    const isOpen = activeFaq === index;
    return (
      <div
        key={faq._id || index}
        className={`bg-white/10 hover:bg-transparent! backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden 
          ${isOpen
            ? "border-white/30 shadow-[0_12px_30px_rgba(255,255,255,0.1)]"
            : "border-white/10 hover:border-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.05)]"
          }`}
      >
        <Button
          onClick={() => setActiveFaq(isOpen ? null : index)}
          className="w-full h-[75px] flex items-center justify-between gap-4 sm:p-6 p-4 text-left focus:outline-none bg-transparent  transition-colors border-none shadow-none"
        >
          <span className="text-[17px] font-bold text-white tracking-tight leading-snug break-all whitespace-normal line-clamp-2">
            {faq.title}
          </span>
          <div
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 
              ${isOpen
                ? "bg-white border-white text-[#001a2e]"
                : "bg-white/10 border-white/20 text-white"
              }`}
          >
            {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
          </div>
        </Button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="sm:px-6 px-4 sm:pb-6 pb-4 text-md text-slate-200 leading-relaxed border-t border-white/10 pt-4">
                {faq.description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section className="relative py-[calc(48px+(100-48)*((100vw-320px)/(1920-320)))] bg-gradient-to-r from-[#001a2e] via-[#012d46] to-[#013d5e] overflow-hidden" id="faqs">
      {/* Immersive background box grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern-light" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))]">
          <h2 className="text-[calc(26px+(42-26)*((100vw-320px)/(1920-320)))] font-extrabold text-white tracking-tight leading-[1.15] max-w-3xl mx-auto">{faqSection.section_heading}</h2>
        </div>

        {/* Expandable Accordions */}
        {faqsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:px-6 px-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl max-w-xl mx-auto text-center w-full shadow-sm">
            <div className="w-14 h-14 mb-4 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("no_faqs_found")}</h3>
            <p className="text-slate-300 text-sm max-w-sm">{t("no_faqs_found_desc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1450px] mx-auto items-start">
            <div className="flex flex-col gap-6">{faqsData.map((faq, index) => index % 2 === 0 && renderFaqItem(faq, index))}</div>
            <div className="flex flex-col gap-6">{faqsData.map((faq, index) => index % 2 === 1 && renderFaqItem(faq, index))}</div>
          </div>
        )}
      </div>
    </section>
  );
}
