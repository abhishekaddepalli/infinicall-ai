'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { WidgetAnalyticsCardsProps } from '@/types/dashboard'
import { motion } from 'framer-motion'
import { Activity, Clock, Monitor, PhoneCall } from 'lucide-react'
import CountUp from 'react-countup'
import { useTranslation } from 'react-i18next'

export function WidgetAnalyticsCards({ analytics, isLoading }: WidgetAnalyticsCardsProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 xl1199:grid-cols-3 lg991:grid-cols-2 md560:grid-cols-1 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[104px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!analytics) return null

  const statCards = [
    {
      title: t('all_widgets', 'All Widgets'),
      value: analytics.totalWidgets,
      icon: Monitor,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/10 text-blue-500',
      glow: 'shadow-blue-500/10 hover:border-blue-500/30'
    },
    {
      title: t('enabled_widgets', 'Enabled Widgets'),
      value: analytics.activeWidgets,
      icon: Activity,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-500/10 text-emerald-500',
      glow: 'shadow-emerald-500/10 hover:border-emerald-500/30'
    },
    {
      title: t('total_calls', 'Total Call Records'),
      value: analytics.totalWidgetCalls,
      icon: PhoneCall,
      color: 'from-violet-500 to-fuchsia-500',
      bgColor: 'bg-violet-500/10 text-violet-500',
      glow: 'shadow-violet-500/10 hover:border-violet-500/30'
    },
    {
      title: t('total_durations', 'Total Durations'),
      value: analytics.totalWidgetSeconds,
      icon: Clock,
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-500/10 text-orange-500',
      glow: 'shadow-orange-500/10 hover:border-orange-500/30',
      formatValue: (seconds: number) => {
        if (!seconds) return '0s';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
      }
    }
  ]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 xl1199:grid-cols-3 lg991:grid-cols-2 md767:grid-cols-2! md560:grid-cols-1! gap-4 mb-6"
    >
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ y: -4 }}
            className={`relative group overflow-hidden bg-bg-card rounded-radius border border-input-border-color sm:p-5 p-4 transition-all duration-300 hover:shadow-xl ${stat.glow}`}
          >
            <div className={`absolute top-0 right-0 rtl:right-[unset]! rtl:left-0 -mt-6 -mr-6 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-2xl opacity-[0.10] group-hover:opacity-[0.20] transition-opacity duration-500 pointer-events-none`} />

            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} transition-colors duration-300 shadow-sm`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>

              <div className="flex flex-col">
                <span className="text-base font-semibold text-subtitle-color mb-0.5">{stat.title}</span>
                <span className="text-2xl font-black text-title tracking-tight">
                  {stat.formatValue ? stat.formatValue(stat.value) : (
                    <CountUp end={stat.value} duration={2} separator="," />
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  )
}
