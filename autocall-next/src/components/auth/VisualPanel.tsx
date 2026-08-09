import { VisualPanelProps } from "@/types/layout";
import { AnimatePresence, motion } from "framer-motion";
import { AppWindow, Bot, BrainCircuit, Megaphone } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

export const VisualPanel: React.FC<VisualPanelProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Voice & SMS Agents",
      desc: "Deploy intelligent conversational agents across multiple communication channels.",
      color: "from-sky-400 to-blue-500",
      glow: "shadow-[0_0_20px_rgba(56,189,248,0.5)]"
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: "Outbound Campaigns",
      desc: "Scale your outreach with automated, scheduled voice and SMS campaigns.",
      color: "from-emerald-400 to-teal-500",
      glow: "shadow-[0_0_20px_rgba(52,211,153,0.5)]"
    },
    {
      icon: <AppWindow className="w-6 h-6" />,
      title: "Embeddable Widgets",
      desc: "Seamlessly integrate custom AI agents directly into your website.",
      color: "from-indigo-400 to-violet-500",
      glow: "shadow-[0_0_20px_rgba(129,140,248,0.5)]"
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Advanced AI Models",
      desc: "Power your automation with highly capable, customizable language models.",
      color: "from-amber-400 to-orange-500",
      glow: "shadow-[0_0_20px_rgba(251,191,36,0.5)]"
    }
  ];

  // Auto rotation
  React.useEffect(() => {
    if (hoveredIdx !== null) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [hoveredIdx, features.length]);

  const displayIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;
  const currentFeature = features[displayIdx];

  return (
    <div className={`w-full h-full flex flex-col justify-between p-12 xl:p-20 text-white relative overflow-hidden select-none bg-[#020a12] ${className}`}>
      {/* Backgrounds */}
      <Image
        src="/authBg.png"
        alt="Auth Background"
        fill
        className="object-cover pointer-events-none select-none z-0 mix-blend-luminosity opacity-40"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-[#001726]/80 to-[#020a12] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020a12_100%)] opacity-90 z-0 pointer-events-none" />

      {/* Floating Cards (Restored original top layout) */}
      <div className="relative z-10 flex-1 w-full mt-4 xl:mt-8 h-[400px] max-w-[530px] mx-auto">
        {/* Card 1 - Top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ opacity: { duration: 0.6 }, y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
          className="absolute p-2 top-[-11%] right-[36%] w-[300px] rounded-[18px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 group cursor-pointer z-10"
        >
          <Image src="/auth10.png" alt="Dashboard Card 1" width={300} height={212} className="object-cover rounded-[14px] items-center justify-center transition-transform duration-500 group-hover:scale-100" priority />
        </motion.div>

        {/* Card 2 - Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{ opacity: { duration: 0.6 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.6 } }}
          className="absolute p-2 top-[21%] -right-[2%] w-[300px] h-[195px] rounded-[18px] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.32)] border border-white/10 group cursor-pointer z-20"
        >
          <Image src="/auth30.png" alt="Dashboard Card 2" width={300} height={240} className="object-cover rounded-[14px] transition-transform duration-500 group-hover:scale-105" priority />
        </motion.div>

        {/* Card 3 - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ opacity: { duration: 0.6 }, y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.3 } }}
          className="absolute p-2 top-[45%] left-[14%] w-[300px] h-[205px] rounded-[18px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.35)] border border-white/10 group cursor-pointer z-30"
        >
          <Image src="/auth20.png" alt="Dashboard Card 3" width={300} height={260} className="object-cover rounded-[14px] transition-transform duration-500 group-hover:scale-105" priority />
        </motion.div>
      </div>

      {/* Bottom Features - macOS Style Dock Design */}
      <div className="w-full relative z-30 mt-auto pb-4 pt-12 flex flex-col items-center">

        {/* Dynamic Text Display */}
        <div className="h-[80px] flex flex-col items-center justify-center text-center max-w-[420px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`feature-${displayIdx}`}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-2"
            >
              <h3 className="text-[22px] font-bold text-white tracking-wide">
                {currentFeature.title}
              </h3>
              <p className="text-[15px] text-sky-100/70 font-medium">
                {currentFeature.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Floating Dock */}
        <div
          className="flex items-center gap-4 "
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {features.map((feature, idx) => {
            const isHovered = hoveredIdx === idx;
            const isActive = displayIdx === idx;
            return (
              <div
                key={`dock-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                className={`relative group flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-300 ease-out z-10 ${isHovered ? "-translate-y-4 scale-100 z-50" : isActive ? "scale-110" : "hover:scale-110"
                  }`}
              >
                {/* Icon Container */}
                <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${isActive || isHovered
                    ? "bg-gradient-to-br " + feature.color + " text-white " + feature.glow
                    : "bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white/80"
                  }`}>
                  {feature.icon}
                </div>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    key={`indicator-${idx}`}
                    layoutId="dockIndicator"
                    className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-white/70"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
