"use client";

import { getImageUrl } from "@/lib/utils";
import { FeaturesProps } from "@/types/landing";
import { motion, Variants } from "framer-motion";
import { Cpu, GitBranch, Megaphone, Users } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function Features({ primaryFeaturesData }: FeaturesProps) {
  const { t } = useTranslation();

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

  // Extract cards from content
  const leftCard = primaryFeaturesData.content?.left_card;
  const cards = primaryFeaturesData.content?.cards || [];

  // Map each key to custom icons and descriptive styles
  const workflowCard = cards.find(c => c.key === "builder") || cards[0];
  const campaignsCard = cards.find(c => c.key === "campaigns") || cards[1];
  const syncCard = cards.find(c => c.key === "sync") || cards[2];
  const toolboxCard = cards.find(c => c.key === "toolbox") || cards[3];

  return (
    <section className="relative py-[calc(40px+(96-40)*((100vw-320px)/(1920-320)))] bg-gradient-to-b from-white via-primary/[0.02] to-white" id="features">
      {/* Premium Features Dot Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.15] bg-dot-pattern-lg" />

      {/* Dynamic Background Grids and Accents */}
      <div className="absolute top-[10%] left-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(1,84,130,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] text-center mb-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))] relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="flex flex-col items-center">
          {/* Heading */}
          <motion.h2 variants={itemVariants} className="text-[calc(22px+(46-22)*((100vw-320px)/(1920-320)))] leading-[1.1] font-extrabold text-[#0a0f1a] tracking-tight max-w-3xl mx-auto mb-[calc(10px+(16-10)*((100vw-320px)/(1920-320)))]">
            {primaryFeaturesData.title}
          </motion.h2>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-[calc(14px+(18-14)*((100vw-320px)/(1920-320)))] text-[#657489] max-w-2xl mx-auto leading-relaxed">
            {primaryFeaturesData.subtitle}
          </motion.p>
        </motion.div>
      </div>

      {/* Premium Grid Features Showcase */}
      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-input-border-color sm:p-6 p-4 flex flex-col justify-between group hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/[0.04] to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center flex-wrap gap-3 justify-between mb-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-base font-bold text-primary">{t('ai_voice_assistants')}</span>
              </div>
            </div>

            <div className="mb-6 relative z-10 max-w-lg">
              <h3 className="text-[calc(20px+(24-20)*((100vw-320px)/(1920-320)))] font-bold text-[#0a0f1a] leading-tight mb-3">{leftCard?.title || t('human_like_voice_conversations')}</h3>
              <p className="text-[14px] text-[#657489] leading-relaxed">{leftCard?.description || "Engage callers instantly with AI voice agents that answer questions, collect details, and move customers through your workflow."}</p>
            </div>

            {/* Horizontal Flow Visualizer Image */}
            <div className="relative h-56 w-full rounded-xl bg-[#f8fafc] border border-input-border-color overflow-hidden flex items-center justify-center p-4">
              <Image 
                src={leftCard?.image && leftCard?.image !== "" ? getImageUrl(leftCard.image) : "/assets/images/subsecond-voice.png"} 
                alt="Sub-Second Voice AI Visualizer" 
                className="object-contain" 
                width={600}
                height={200}
                unoptimized
              />
            </div>

            {/* Premium hover gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>

          {/* ──────────────── CARD 2: Workflow Builder (lg:col-span-1) ──────────────── */}
          {workflowCard && (
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-2xl border border-input-border-color sm:p-6 p-4 flex flex-col justify-between group hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] transition-all duration-500 relative overflow-hidden">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-title-color leading-tight">{workflowCard.title || t('workflow_builder')}</h3>
                </div>

                <p className="text-[14px] text-subtitle-color leading-relaxed mb-6">{workflowCard.description || "Visual drag-and-drop builder to automate your business processes."}</p>
              </div>

              {/* Workflow Builder Image */}
              <div className="relative h-56 w-full rounded-xl bg-[#f8fafc] border border-input-border-color overflow-hidden flex items-center justify-center p-4">
                <Image 
                  src={workflowCard?.image && workflowCard?.image !== "" ? getImageUrl(workflowCard.image) : "/assets/images/workflow.png"} 
                  alt="Workflow Builder Visualizer" 
                  className="object-contain" 
                  width={370}
                  height={200}
                  unoptimized
                />
              </div>
            </motion.div>
          )}

          {/* ──────────────── CARD 3: Smart Campaigns (lg:col-span-1) ──────────────── */}
          {campaignsCard && (
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-2xl border border-input-border-color sm:p-6 p-4 flex flex-col justify-between group hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] transition-all duration-500 relative overflow-hidden">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-title-color leading-tight">{campaignsCard.title || t('outbound_call_campaigns')}</h3>
                </div>

                <p className="text-[14px] text-subtitle-color leading-relaxed mb-6">{campaignsCard.description || "Launch outbound voice campaigns at scale and drive real results."}</p>
              </div>

              {/* Smart Campaigns Image */}
              <div className="relative h-56 rounded-xl bg-[#f8fafc] border border-input-border-color overflow-hidden flex items-center justify-center p-4">
                <Image 
                  src={campaignsCard?.image && campaignsCard?.image !== "" ? getImageUrl(campaignsCard.image) : "/assets/images/campaign.png"} 
                  alt="Smart Campaigns Visualizer" 
                  className="object-contain" 
                  width={400}
                  height={400}
                  unoptimized
                />
              </div>
            </motion.div>
          )}

          {/* ──────────────── CARD 4: Train AI (lg:col-span-1) ──────────────── */}
          {syncCard && (
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-2xl border border-input-border-color sm:p-6 p-4 flex flex-col justify-between group hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] transition-all duration-500 relative overflow-hidden">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-title-color leading-tight">{t('train_ai')}</h3>
                </div>

                <p className="text-[14px] text-subtitle-color leading-relaxed mb-6">{t('upload_knowledge')}</p>
              </div>

              {/* Train AI Image */}
              <div className="relative h-56 w-full rounded-xl bg-[#f8fafc] border border-input-border-color overflow-hidden flex items-center justify-center p-4">
                <Image 
                  src={syncCard?.image && syncCard?.image !== "" ? getImageUrl(syncCard.image) : "/assets/images/train-ai.png"} 
                  alt="Train AI Visualizer" 
                  className=" object-contain" 
                  width={400}
                  height={400}
                  unoptimized
                />
              </div>
            </motion.div>
          )}

          {/* ──────────────── CARD 5: Contact Hub & CRM (lg:col-span-1) ──────────────── */}
          {toolboxCard && (
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-2xl border border-input-border-color sm:p-6 p-4 flex flex-col justify-between group hover:border-primary/25 hover:shadow-[0_20px_40px_rgba(1,84,130,0.06)] transition-all duration-500 relative overflow-hidden">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-title-color leading-tight">{t('contact_hub_crm')}</h3>
                </div>

                <p className="text-[14px] text-subtitle-color leading-relaxed mb-6">{t('contact_hub_desc')}</p>
              </div>

              {/* Contact Hub Image */}
              <div className="relative h-56 w-full rounded-xl bg-[#f8fafc] border border-input-border-color overflow-hidden flex items-center justify-center p-4">
                <Image 
                  src={toolboxCard?.image && toolboxCard?.image !== "" ? getImageUrl(toolboxCard.image) : "/assets/images/contact.png"} 
                  alt="Contact Hub Visualizer" 
                  className="object-contain" 
                  width={400}
                  height={400}
                  unoptimized
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
