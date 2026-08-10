"use client";

import { getImageUrl } from "@/lib/utils";
import { HumanTransferProps } from "@/types/landing";
import { motion, Variants } from "framer-motion";
import { Zap, Users, MessageSquare, Settings, Target, ArrowRightLeft, BarChart, CheckCircle, Lightbulb } from "lucide-react";
import Image from "next/image";

export function HumanTransfer({ humanTransferData }: HumanTransferProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
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

  const HT_ICONS = [Zap, Users, ArrowRightLeft, BarChart, Settings, Target, CheckCircle, Lightbulb, MessageSquare];
  const HT_COLORS = [
    "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    "bg-purple-500/10 border-purple-500/20 text-purple-400",
    "bg-orange-500/10 border-orange-500/20 text-orange-400",
    "bg-rose-500/10 border-rose-500/20 text-rose-400",
    "bg-amber-500/10 border-amber-500/20 text-amber-400",
  ];

  return (
    <section className="relative py-8 lg:py-12 bg-gradient-to-r from-[#001a2e] via-[#012d46] to-[#013d5e] overflow-hidden" id="human-transfer">
      {/* Background Grids matching Automate */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern" />
      <div className="absolute top-[10%] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(1,84,130,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        <motion.div whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

          {/* Left Content Area */}
          <div className="lg:w-[50%] flex flex-col justify-center">

            <motion.h2 variants={itemVariants} className="text-[calc(28px+(46-28)*((100vw-320px)/(1920-320)))] leading-[1.15] font-extrabold text-white tracking-tight mb-6">
              {humanTransferData?.title || "Smart conversations."} <br />
              {humanTransferData?.subtitle || "Seamless human connection."}
            </motion.h2>

            <motion.p variants={itemVariants} className="text-[calc(14px+(16-14)*((100vw-320px)/(1920-320)))] text-slate-400 leading-relaxed mb-10 max-w-lg">
              {humanTransferData?.description || "Enable human transfer in your AI agents and let important conversations flow to the right team member—instantly."}
            </motion.p>

            {/* Feature List */}
            <div className="space-y-6">
              {humanTransferData?.bottom_features?.map((feature, index) => {
                const Icon = HT_ICONS[index % HT_ICONS.length];
                const colorClass = HT_COLORS[index % HT_COLORS.length];
                return (
                  <motion.div key={index} variants={itemVariants} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-white mb-1.5">{feature.title}</h4>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Image Area */}
          <motion.div variants={itemVariants} className="lg:w-[50%] w-full relative">
            <div className="relative w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-6 lg:p-8 backdrop-blur-sm">
              <Image
                src={humanTransferData?.image && humanTransferData?.image !== "" ? getImageUrl(humanTransferData.image) : "/assets/images/human_transfer.png"}
                alt={humanTransferData?.badge || "Human Transfer Flow"}
                className="w-full h-auto object-contain max-w-[500px]"
                width={1000}
                height={800}
                unoptimized
              />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
