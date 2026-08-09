"use client";

import { getImageUrl } from "@/lib/utils";
import { AddonsProps } from "@/types/landing";
import { motion, Variants } from "framer-motion";
import { BarChart3, Code, MessageSquare, Shield, UserPlus, Users, Link, Puzzle, Settings, ArrowRight } from "lucide-react";
import Image from "next/image";

export function Addons({ addonsData }: AddonsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
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

  const cards = addonsData?.cards || [];

  // Dynamic design sets
  const ICONS = [MessageSquare, Code, Users, BarChart3, Shield, UserPlus, Link, Puzzle, Settings, ArrowRight];
  const COLORS = [
    "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600",
    "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600",
    "bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-600",
    "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600",
    "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600",
  ];

  return (
    <section className="relative py-[calc(40px+(96-40)*((100vw-320px)/(1920-320)))] bg-gradient-to-b from-white via-primary/[0.02] to-white" id="addons">
      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.15] bg-dot-pattern-lg" />
      <div className="absolute top-[10%] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(1,84,130,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] text-center mb-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))] relative z-10">
        <motion.div whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="flex flex-col items-center">
          <motion.h2 variants={itemVariants} className="text-[calc(22px+(46-22)*((100vw-320px)/(1920-320)))] leading-[1.1] font-extrabold text-[#0a0f1a] tracking-tight max-w-3xl mx-auto mb-[calc(10px+(16-10)*((100vw-320px)/(1920-320)))]">
            {addonsData?.title || "Powerful Add-ons for Your Business"}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-[calc(14px+(18-14)*((100vw-320px)/(1920-320)))] text-[#657489] max-w-2xl mx-auto leading-relaxed">
            {addonsData?.subtitle || "Enhance your workflow with premium extensions and manage your business operations seamlessly."}
          </motion.p>
        </motion.div>
      </div>

      {/* Grid Showcase */}
      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {cards.map((card, index) => {
            const Icon = ICONS[index % ICONS.length];
            const colorClass = COLORS[index % COLORS.length];
            const isFullWidth = index % 3 === 2; // Make every 3rd card full width

            return (
              <motion.div key={index} variants={itemVariants} className={`bg-white rounded-2xl border border-input-border-color sm:p-6 p-4 flex flex-col ${isFullWidth ? 'lg:flex-row lg:col-span-2 items-center gap-10' : 'justify-start gap-6'} group hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] transition-all duration-500 relative overflow-hidden`}>
                <div className={isFullWidth ? "lg:w-[40%] flex flex-col justify-start" : ""}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:text-white ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-title-color leading-tight">{card.title}</h3>
                  </div>
                  <p className={`text-[14px] text-subtitle-color leading-relaxed ${card.badges && card.badges.length > 0 ? 'mb-4' : 'mb-0'}`}>{card.description}</p>

                  {/* Badges */}
                  {card.badges && card.badges.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {card.badges.map((badge, bIdx) => {
                        // Use a deterministic icon from the list for each badge
                        const BadgeIcon = ICONS[(index + bIdx + 1) % ICONS.length];
                        return (
                          <div key={bIdx} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary text-[13px] font-medium rounded-lg border border-primary/10">
                            <BadgeIcon className="w-4 h-4" />
                            {badge}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Image Placeholder */}
                <div className={`relative ${isFullWidth ? "h-auto w-full lg:w-[60%]" : "max-h-[436px] w-full"} rounded-xl bg-[#f8fafc] border border-input-border-color overflow-hidden flex items-center justify-center p-4`}>
                  <Image
                    src={card?.image && card?.image !== "" ? getImageUrl(card.image) : ["/assets/images/sms-campaign.png", "/assets/images/rest-api.png", "/assets/images/team.png"][index % 3]}
                    alt={card.title}
                    className="w-full h-full object-contain"
                    width={isFullWidth ? 1200 : 800}
                    height={isFullWidth ? 500 : 400}
                    unoptimized
                    priority
                  />
                </div>
              </motion.div>
            );
          })}

        </motion.div>
      </div>
    </section>
  );
}
