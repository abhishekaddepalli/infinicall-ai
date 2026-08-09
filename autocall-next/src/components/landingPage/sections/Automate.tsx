"use client";

import { AutomateProps } from "@/types/landing";
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
  Phone, UserCheck, Calendar, Headset, RefreshCw, Star,
  UserPlus, FileText, Megaphone, Bot, Zap, Settings, Mail,
  MessageSquare, BarChart3, Shield, Globe, Mic,
};

function getIcon(name: string): ReactElement {
  const Icon = iconMap[name] || Phone;
  return <Icon className="w-6 h-6" />;
}

const AUTOMATE_COLORS = [
  { color: "from-[#3b82f6] to-[#2563eb]", border: "border-[#3b82f6]/30", glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]" },
  { color: "from-[#06b6d4] to-[#0891b2]", border: "border-[#06b6d4]/30", glow: "shadow-[0_0_20px_rgba(6,182,212,0.25)]" },
  { color: "from-[#ec4899] to-[#db2777]", border: "border-[#ec4899]/30", glow: "shadow-[0_0_20px_rgba(236,72,153,0.25)]" },
  { color: "from-[#f43f5e] to-[#e11d48]", border: "border-[#f43f5e]/30", glow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]" },
  { color: "from-[#8b5cf6] to-[#7c3aed]", border: "border-[#8b5cf6]/30", glow: "shadow-[0_0_20px_rgba(139,92,246,0.25)]" },
  { color: "from-[#f59e0b] to-[#d97706]", border: "border-[#f59e0b]/30", glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]" }
];

export function Automate({ automateData }: AutomateProps) {
  const heading = automateData?.heading || "Automate Customer Engagement at Scale";
  const automateCards = automateData?.cards || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 16 },
    },
  };

  return (
    <section className="relative py-[calc(48px+(100-48)*((100vw-320px)/(1920-320)))] bg-gradient-to-r from-[#001a2e] via-[#012d46] to-[#013d5e] overflow-hidden" id="automate">
      {/* Line Grid Background (matching Integrations section) */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern" />

      {/* Ambient Glows */}
      <div className="absolute top-[10%] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(1,84,130,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full px-[calc(8px+(16-8)*((100vw-320px)/(1920-320)))] text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="flex flex-col items-center mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <motion.h2 variants={itemVariants} className="text-[calc(26px+(42-26)*((100vw-320px)/(1920-320)))] font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {heading}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-12 h-0.5 bg-white/20 rounded-full"></motion.div>
        </motion.div>

        <div className="relative flex overflow-hidden w-full py-4" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <motion.div 
            className="flex gap-4 xl:gap-6 shrink-0 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 50, repeat: Infinity }}
          >
            {[...automateCards, ...automateCards, ...automateCards, ...automateCards].map((card, index) => {
              const style = AUTOMATE_COLORS[index % AUTOMATE_COLORS.length];
              return (
              <div key={index} className="w-[280px] sm:w-[320px] shrink-0 bg-white/10 backdrop-blur-sm rounded-[24px] px-4 py-10 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all duration-300 flex flex-col items-center text-center cursor-default min-h-[320px] justify-start whitespace-normal group">
                <div className={`w-[60px] h-[60px] rounded-2xl bg-gradient-to-br ${style.color} ${style.border} border flex items-center justify-center text-white mb-6 ${style.glow} transition-all duration-300 group-hover:scale-110 shrink-0`}>
                  {getIcon(card.icon || "Phone")}
                </div>
                <h3 className="text-[15px] xl:text-[16px] font-bold text-white mb-4 leading-snug whitespace-nowrap lg:whitespace-normal xl:whitespace-nowrap">{card.title}</h3>
                <div className="w-8 h-[2px] bg-white/20 rounded-full mb-4 group-hover:bg-white/40 transition-colors shrink-0"></div>
                <p className="text-md text-slate-400 font-medium leading-relaxed">{card.description}</p>
              </div>
            )})}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
