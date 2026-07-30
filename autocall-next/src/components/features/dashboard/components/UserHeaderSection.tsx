'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { UserHeaderSectionProps } from '@/types/dashboard'
import { differenceInDays } from 'date-fns'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronRight,
  Package,
  ShieldCheck
} from 'lucide-react'
import { WelcomeCard } from './WelcomeCard'

export function UserHeaderSection({
  userName,
  quickAccessItems,
  sub,
  router,
  t,
  cardVariants
}: UserHeaderSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-[1480px]:grid-cols-3 gap-6 items-stretch">
      {/* Item 1: Custom User Welcome Card (Deep Violet/Indigo themed) */}
      <WelcomeCard
        badge={t('autocall_workspace')}
        title={t('hello_user')}
        subtitle={t('user_subtitle_custom')}
        gradientClass=""
        className="sm:p-6 p-4 flex flex-col justify-between h-full shadow-lg shadow-indigo-500/5 w-full"
      />

      {/* Item 2: Quick Access List Card */}
      <motion.div
        variants={cardVariants}
        className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card flex flex-col h-full"
      >
        <div className="flex flex-col h-full">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {t('quick_shortcuts')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 flex-grow">
            {quickAccessItems.map((item, idx) => {
              const ItemIcon = item.icon

              const colorClasses = [
                'bg-blue-500/10 text-blue-500',     // 0: AI Voice Agents
                'bg-purple-500/10 text-purple-500', // 1: AI Campaign Hub
                'bg-indigo-500/10 text-indigo-500', // 2: Conversation Templates
                'bg-emerald-500/10 text-emerald-500' // 3: Contact Hub
              ]
              const iconColorClass = colorClasses[idx % colorClasses.length]

              return (
                <div
                  key={idx}
                  onClick={() => router.push(item.path)}
                  className="group flex flex-col p-4 rounded-lg bg-subcard hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer h-full"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 shrink-0 ${iconColorClass}`}>
                    <ItemIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-md font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                      {item.desc}
                    </span>
                  </div>
                </div>
              )
            })}
            {quickAccessItems.length === 0 && (
              <div className="col-span-1 sm:col-span-2 text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                {t('no_shortcuts_available')}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Item 3: Current Active Plan & Empty State Card */}
      <motion.div
        variants={cardVariants}
        className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card shadow-sm dark:shadow-none flex flex-col justify-between h-full md:col-span-2 min-[1480px]:col-span-1"
      >
        {sub ? (
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-input-border-color pb-4">
                <div className="flex flex-col">
                  <h2 className="text-base font-semibold text-title tracking-tight">
                    {t('active_plan')}
                  </h2>
                  <span className="text-md font-medium text-subtitle-color mt-0.5">
                    {t('desc_active_plan', 'Review your current subscription tier and platform limits.')}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold tracking-wider uppercase">
                  {sub.status || t('active')}
                </span>
              </div>

              <div className='max-h-[162px] overflow-auto no-scrollbar'>
                <div className="mt-4 p-3 gap-2 rounded-lg border border-emerald-500/10 bg-emerald-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-md font-bold text-title line-clamp-1 break-all whitespace-normal">
                        {sub.plan?.name || t('standard_pro')}
                      </span>
                      <span className="text-sm text-subtitle-color line-clamp-1 break-all whitespace-normal">
                        {sub.plan_id?.billing_cycle || 'monthly'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-subtitle-color">
                    ₹{sub.amount_paid || sub.amount || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-md font-medium text-subtitle-color">
                <span>{t('days_remaining')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {sub.days_remaining ?? (sub.current_period_end ? Math.max(0, differenceInDays(new Date(sub.current_period_end), new Date())) : 0)} {t('days')}
                </span>
              </div>
              <div className="flex items-center justify-between text-md font-medium text-subtitle-color">
                <span>{t('agent_limits')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {(() => {
                    const limit = sub.plan?.agent_limit ?? (sub.plan_id as any)?.agent_limit;
                    if (limit === undefined || limit === null) return '—';
                    return limit === -1 ? t('unlimited', 'Unlimited') : limit;
                  })()}
                </span>
              </div>

              <Button
                onClick={() => router.push(ROUTES.SUBSCRIPTIONS)}
                className="w-full mt-2 h-10 rounded-lg bg-primary text-sm font-bold text-white p-padding! transition-colors flex items-center justify-center gap-1.5"
              >
                {t('manage_plan')}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          // No Plan Empty State View
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-input-border-color pb-4">
                <div className="flex flex-col">
                  <h2 className="text-base font-semibold text-title tracking-tight">
                    {t('active_plan')}
                  </h2>
                  <span className="text-md font-medium text-subtitle-color mt-0.5">
                    {t('desc_active_plan_unsubscribed', 'Your workspace operates without an active plan.')}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-bold tracking-wider uppercase">
                  {t('unsubscribed')}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-4 text-center h-full">
                <div className="p-3 rounded-lg bg-primary/15 dark:bg-white/5 border border-input-border-color text-primary mb-2">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-title tracking-tight mb-2">
                  {t('no_active_plan')}
                </h4>
                <p className="text-subtitle-color max-w-md text-sm">
                  {t('no_active_plan_desc')}
                </p>
              </div>
            </div >

            <Button
              onClick={() => router.push(ROUTES.PLANS)}
              className="w-full h-12 text-base rounded-lg bg-primary hover:bg-primary/95 text-white text-md font-bold shadow-sm transition-colors flex items-center justify-center gap-1 mt-auto"
            >
              {t('explore_plans_dashboard')}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div >
        )
        }
      </motion.div >
    </div >
  )
}
