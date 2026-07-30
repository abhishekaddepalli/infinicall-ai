"use client";

import { getImageUrl } from "@/lib/utils";
import { HeroProps } from "@/types/landing";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function Hero({ heroData }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    },
  };

  return (
    <section className="relative z-10 w-full overflow-hidden bg-transparent">
      {/* Nexwrite-style Boxes Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern-hero" />

      {/* Subtle Ambient top glows */}
      <div className="absolute top-[-180px] left-[15%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(1,84,130,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-[-80px] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Vibrant Purple-Blue Radial Glow directly behind/underneath the mockup */}

      <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-[calc(10px+(64-10)*((100vw-320px)/(1920-320)))] flex flex-col items-center">
        {/* Main Content Area: Centered (Nexwrite Style) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-center flex flex-col items-center mb-[calc(20px+(40-20)*((100vw-320px)/(1920-320)))]"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-[calc(20px+(56-20)*((100vw-320px)/(1920-320)))] font-extrabold text-[#0a0f1a] leading-[1.1] max-w-4xl mb-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] tracking-tight"
          >
            {heroData.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[calc(14px+(18-14)*((100vw-320px)/(1920-320)))] text-[#657489] max-w-2xl mb-[calc(20px+(32-20)*((100vw-320px)/(1920-320)))] leading-relaxed font-normal"
          >
            {heroData.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-primary text-white font-semibold text-sm rounded-radius"
            >
              {heroData.content?.cta_text || "Let's Talk"}
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
            {heroData.content?.docs_text && (
              < motion.a
                href={heroData.content?.cta_secondary_link || "https://docs.pixelstrap.net/autocall"}
                target="_blank"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-primary bg-primary/10 font-semibold text-sm rounded-radius border border-input-border-color hover:bg-primary hover:text-white"
              >
                {heroData.content.docs_text}
              </motion.a>
            )}
          </motion.div>
        </motion.div>
        {/* Large Centered Product Preview (Nexwrite Style) */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 16,
            delay: 0.2,
          }}
          className="w-full relative flex items-center justify-center z-10"
        >
          {/* Browser Window Mockup wrapper */}
          <div className="relative w-full max-w-5xl overflow-hidden ">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={
                  heroData.content?.image && heroData.content?.image !== ""
                    ? getImageUrl(heroData.content?.image)
                    : "/assets/images/hero-2.png"
                }
                alt="Hero section image"
                className="object-contain relative"
                width={1080}
                height={667}
                unoptimized
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section >
  );
}
