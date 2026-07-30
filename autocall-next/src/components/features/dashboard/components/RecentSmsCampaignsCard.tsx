'use client'

import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function RecentSmsCampaignsCard({ stats, cardVariants, t }: any) {
  return (
    <motion.div
      variants={cardVariants}
      className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card flex flex-col h-111.75"
    >
      <div className="flex flex-wrap gap-3 items-center justify-between border-b border-input-border-color pb-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-title tracking-tight">
            {t('recent_sms_campaigns')}
          </h2>
          <span className="text-md font-medium text-subtitle-color mt-0.5">
            {t('desc_recent_sms_campaigns', 'Monitor delivery and status of recent text campaigns.')}
          </span>
        </div>
        <Link href={ROUTES.SMS_CAMPAIGNS} className="text-md font-bold text-subtitle-color cursor-pointer">
          {t('see_all', 'See All')}
        </Link>
      </div>

      <div className="overflow-auto mt-4 flex-1 no-scrollbar space-y-3">
        {(stats.tables.recentSmsCampaigns || []).map((cpn: any, i: number) => {
          const initials = cpn.name ? cpn.name.substring(0, 2).toUpperCase() : 'SC'
          const agent = cpn.agentId?.name || t('manual')
          const phone = cpn.phoneNumberId?.phone_number || t('default')
          const status = cpn.status || cpn.campaignStatus || t('unknown')

          return (
            <div key={i} className="flex items-center p-3 bg-subcard rounded-lg border border-input-border-color dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xs font-bold mr-3 shrink-0">
                {initials}
              </div>
              <div className="flex-1 flex flex-col min-w-0 pr-3">
                <span className="text-md font-bold text-title truncate">
                  {cpn.name}
                </span>
                <span className="text-md text-subtitle-color mt-0.5 truncate">
                  {t('agent')}: {agent} <span className="mx-1">•</span> {t('number')}: {phone}
                </span>
              </div>
              <div className="shrink-0">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${status.toLowerCase() === 'active' || status.toLowerCase() === 'completed'
                  ? 'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : status.toLowerCase() === 'pending'
                    ? 'bg-yellow-100/50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                  }`}>
                  {status}
                </span>
              </div>
            </div>
          )
        })}
        {(!stats.tables.recentSmsCampaigns || stats.tables.recentSmsCampaigns.length === 0) && (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            {t('no_sms_campaigns')}
          </div>
        )}
      </div>
    </motion.div>
  )
}
