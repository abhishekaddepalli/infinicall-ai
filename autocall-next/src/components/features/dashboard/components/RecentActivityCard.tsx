'use client'

import { motion } from 'framer-motion'

export function RecentActivityCard({ stats, cardVariants, t }: any) {
  return (
    <motion.div
      variants={cardVariants}
      className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card flex flex-col h-111.75"
    >
      <div className="flex items-center justify-between border-b border-input-border-color pb-4 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-title tracking-tight">
              {t('recent_activity')}
            </h2>
            <span className="text-md font-medium text-subtitle-color mt-0.5">
              {t('desc_recent_activity', 'Keep track of system-wide actions and updates.')}
            </span>
          </div>
        </div>

      <div className="overflow-auto mt-4 flex-1 no-scrollbar space-y-3">
        {(stats.tables.recentActivity || []).map((activity: any, i: number) => {
          const moduleName = activity.module || activity.type || 'system'
          const initials = moduleName.replace(/_/g, '').substring(0, 2).toUpperCase()
          const action = activity.action || activity.title || t('performed_action')
          
          const formatType = (str: string) => str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          const subtitle = activity.subtitle || formatType(moduleName)
          
          let time = 'Just now'
          if (activity.timestamp) {
            try {
              time = new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } catch (e) {}
          }

          return (
            <div key={i} className="flex items-center p-3 rounded-lg bg-subcard border border-input-border-color dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-bold mr-3 shrink-0">
                {initials}
              </div>
              <div className="flex-1 flex flex-col min-w-0 pr-3">
                <span className="text-[14px] font-bold text-title truncate">
                  {action}
                </span>
                <span className="text-[12px] text-subtitle-color mt-0.5 truncate">
                  {subtitle}
                </span>
              </div>
              <div className="shrink-0">
                <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wide">
                  {time}
                </span>
              </div>
            </div>
          )
        })}
        {(!stats.tables.recentActivity || stats.tables.recentActivity.length === 0) && (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            {t('no_activity')}
          </div>
        )}
      </div>
    </motion.div>
  )
}
