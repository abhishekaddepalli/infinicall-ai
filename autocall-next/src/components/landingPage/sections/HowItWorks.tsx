"use client";

import { HowItWorksProps } from "@/types/landing";
import { motion, Variants } from "framer-motion";
import {
  BarChart3,
  Bot,
  Calendar,
  FileText,
  Globe,
  Headset,
  Mail,
  Megaphone,
  MessageSquare,
  Mic,
  Phone,
  RefreshCw,
  Settings,
  Shield,
  Star,
  UserCheck,
  UserPlus,
  Zap,
  type LucideIcon
} from "lucide-react";
import { ReactElement } from "react";

const iconMap: Record<string, LucideIcon> = {
  UserPlus, FileText, Megaphone, Phone, UserCheck, Calendar,
  Headset, RefreshCw, Star, Bot, Zap, Settings, Mail, MessageSquare,
  BarChart3, Shield, Globe, Mic,
};

function getIcon(name: string): ReactElement {
  const Icon = iconMap[name] || UserPlus;
  return <Icon className="w-6 h-6" />;
}

const STEP_COLORS = [
  { color: "from-[#3b82f6] to-[#2563eb]", border: "border-[#3b82f6]/30", glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]" },
  { color: "from-[#06b6d4] to-[#0891b2]", border: "border-[#06b6d4]/30", glow: "shadow-[0_0_20px_rgba(6,182,212,0.25)]" },
  { color: "from-[#ec4899] to-[#db2777]", border: "border-[#ec4899]/30", glow: "shadow-[0_0_20px_rgba(236,72,153,0.25)]" }
];

export function HowItWorks({ howItWorksData }: HowItWorksProps) {
  const heading = howItWorksData?.heading || "How AutoCall Works";
  const subtitle = howItWorksData?.subtitle || "A seamless journey from setup to results, designed for your growth.";
  const steps = howItWorksData?.steps || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 16 },
    },
  };

  return (
    <section
      className="relative py-[calc(48px+(100-48)*((100vw-320px)/(1920-320)))] bg-gradient-to-r from-[#001a2e] via-[#012d46] to-[#013d5e] overflow-hidden"
      id="how-it-works"
    >
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-[calc(32px+(72-32)*((100vw-320px)/(1920-320)))]"
        >
          <h2 className="text-[calc(26px+(42-26)*((100vw-320px)/(1920-320)))] font-bold text-white tracking-tight leading-[1.15] mb-2">
            {heading}
          </h2>
          <p className="text-[calc(13px+(16-13)*((100vw-320px)/(1920-320)))] text-slate-400 max-w-xl font-medium mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Steps Row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[30px] left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-[2px] bg-gradient-to-r from-[#3b82f6]/40 via-[#06b6d4]/40 to-[#ec4899]/40 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-6">
            {steps.map((step, idx) => {
              const style = STEP_COLORS[idx % STEP_COLORS.length];
              return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center text-center relative z-10"
              >
                {/* Icon */}
                <div
                  className={`w-[60px] h-[60px] rounded-2xl bg-gradient-to-br ${style.color} ${style.border} border flex items-center justify-center text-white mb-6 ${style.glow} transition-all duration-300 hover:scale-110`}
                >
                  {getIcon(step.icon || "UserPlus")}
                </div>

                {/* Title */}
                <h4 className="text-white font-bold text-[15px] sm:text-[16px] mb-2 leading-snug">
                  {step.number || idx + 1}. {step.title}
                </h4>

                {/* Description */}
                <p className="text-slate-400 text-md font-medium leading-relaxed max-w-[220px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            )})}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
