'use client'

import { StatsCardProps } from '@/types/dashboard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CountUp from "react-countup";

export function StatsCard({ title, value, description, icon: Icon, colorClass, glowClass, prefix = '', href }: StatsCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  // Extract the text color class (e.g., text-emerald-500) to use for the gradient glow
  const textColorClass = colorClass.split(' ').find(c => c.startsWith('text-')) || '';
  // Remove the border classes from the icon and add a soft gradient background
  const iconClasses = colorClass.replace(/border-[^\s]+/g, '').replace('border', '').trim();

  const CardContent = (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden sm:p-5 p-4 rounded-radius bg-bg-card border border-input-border-color transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${href ? 'cursor-pointer' : ''} ${glowClass}`}
    >
      {/* Dynamic top-right gradient glow on hover */}
      <div className={`absolute top-0 right-0 rtl:right-[unset]! rtl:left-0 -mt-6 -mr-6 w-32 h-32 rounded-full blur-2xl opacity-[0.15] pointer-events-none bg-current ${textColorClass}`} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-base font-bold text-title transition-colors">
          {title}
        </span>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-2.5 rounded-lg bg-gradient-to-br ${iconClasses} group-hover:shadow-sm transition-all`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      <div className="relative z-10 space-y-1">
        <h3 className="text-2xl font-extrabold text-title tracking-tight">
          {prefix}{typeof value === 'number' ? <CountUp end={value} duration={2} separator="," /> : value}
        </h3>
        <p className="text-md font-medium text-subtitle-color group-hover:text-slate-500 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block w-full h-full">{CardContent}</Link>;
  }

  return CardContent;
}



