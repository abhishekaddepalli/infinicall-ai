'use client'

import { subscriptionStatsConfig } from '@/data/subscription';
import { useTranslation } from 'react-i18next';

const premiumThemeMap: Record<string, {
  iconBg: string;
  iconColor: string;
  borderHover: string;
  glowGradient: string;
}> = {
  total_subscriptions: {
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-500 dark:text-blue-400',
    borderHover: 'hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:shadow-blue-500/5',
    glowGradient: 'from-blue-500/10 to-transparent'
  },
  total_revenue: {
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-emerald-500/5',
    glowGradient: 'from-emerald-500/10 to-transparent'
  },
  current_subscriptions: {
    iconBg: 'bg-green-500/10 dark:bg-green-500/20 border-green-500/20 text-green-600 dark:text-green-400',
    iconColor: 'text-green-500 dark:text-green-400',
    borderHover: 'hover:border-green-500/30 dark:hover:border-green-500/20 hover:shadow-green-500/5',
    glowGradient: 'from-green-500/10 to-transparent'
  },
  subscriptions_expired: {
    iconBg: 'bg-red-500/10 dark:bg-red-500/20 border-red-500/20 text-red-600 dark:text-red-400',
    iconColor: 'text-red-500 dark:text-red-400',
    borderHover: 'hover:border-red-500/30 dark:hover:border-red-500/20 hover:shadow-red-500/5',
    glowGradient: 'from-red-500/10 to-transparent'
  },
  expiring_soon: {
    iconBg: 'bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    borderHover: 'hover:border-yellow-500/30 dark:hover:border-yellow-500/20 hover:shadow-yellow-500/5',
    glowGradient: 'from-yellow-500/10 to-transparent'
  }
}

const SubscriptionStats = ({ statsData }: any) => {
  const { t } = useTranslation()

  const stats = statsData || {}

  return (
    <div className="grid md515:grid-cols-1! xl1480:grid-cols-3 lg991:grid-cols-2! lg:grid-cols-5 sm:gap-6 gap-4 mb-8 pt-4">
      {subscriptionStatsConfig.map((stat, i) => {
        const value = stats[stat.key] || 0;
        const theme = premiumThemeMap[stat.key] || premiumThemeMap.total_subscriptions;

        return (
          <div
            key={i}
            
            className={`group relative overflow-hidden sm:p-6 p-4 rounded-radius bg-bg-card border border-input-border-color shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer ${theme.borderHover} hover:-translate-y-1`}
          >
            {/* Ambient subtle backdrop glow on hover */}
            <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br ${theme.glowGradient} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />

            {/* Inner Content preserving structural layout */}
            <div className="relative items-center z-10 flex gap-5">
              {/* Icon Top Left */}
              <div className={`flex items-center justify-center p-3 rounded-radius h-11.5 w-fit border ${theme.iconBg} group-hover:scale-105 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5" />
              </div>

              {/* Value and Label Bottom Left */}
              <div>
                <p className="text-3xl font-black text-title group-hover:text-primary transition-colors duration-300">
                  {stat.isCurrency ? `₹${value}` : value}
                </p>
                <p className="text-[15px] font-medium text-subtitle-color mt-1.5 transition-colors duration-300 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {t(stat.labelKey)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SubscriptionStats
