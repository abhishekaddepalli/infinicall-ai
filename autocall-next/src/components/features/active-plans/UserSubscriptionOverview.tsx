'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserSubscriptionOverviewProps } from '@/types/plans'
import { formatDate } from '@/utils/auth'
import { AlertCircle, Ban, Calendar, Clock, Crown, FileText, RefreshCw, Wallet } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import UserAIFeatureUsage from './UserAIFeatureUsage'

const UserSubscriptionOverview = ({
  sub,
  amountPaid,
  daysRemaining,
  isCancelDialogOpen,
  setIsCancelDialogOpen,
  handleCancel,
  isCancelling,
  t,
}: UserSubscriptionOverviewProps) => {
  if (!sub) return null

  // Safely extract the plan object if it's populated
  const plan = typeof sub.plan_id === 'object' ? sub.plan_id : null

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-title">{t('subscription', { defaultValue: 'Subscription' })}</h2>
          <p className="text-md text-subtitle-color mt-1">{t('manage_plan_billing_details', { defaultValue: 'Manage your plan and billing details' })}</p>
        </div>
        {!sub.cancel_at_period_end && (sub.status === 'active' || sub.status === 'incomplete') && (
          <div className="flex justify-end">
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-bold gap-2 p-padding! w-full sm:w-auto transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  {t('cancel_subscription')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md! gap-0! max-w-[calc(100%-2rem)]! rounded-modal-radius border-none sm:p-6 p-4">
                <DialogHeader className='text-left rtl:text-right'>
                  <DialogTitle className='text-title'>{t('cancel_subscription')}</DialogTitle>
                  <DialogDescription>
                    {t('retain_access_until', {
                      date: formatDate(sub.current_period_end),
                    })}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCancelDialogOpen(false)}
                    className="w-full flex-1 rounded-lg bg-primary/10 font-bold text-sm border-none sm:h-11 h-10 p-padding! hover:bg-primary hover:text-white text-primary mr-0"
                  >
                    {t('keep_subscription')}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    variant="destructive"
                    className="w-full flex-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive dark:hover:bg-destructive hover:text-white font-bold text-sm sm:h-11 h-10 p-padding!"
                  >
                    {isCancelling ? `${t('cancelling')}...` : t('confirm_cancellation')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-[1200px]:grid-cols-3 gap-6">
        {/* Card 1: Plan */}
        <div className="bg-bg-card border border-input-border-color rounded-lg sm:p-6 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-edit/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-edit" />
                </div>
                <h3 className="font-bold text-title text-lg truncate" title={plan?.name || t('no_active_plan', { defaultValue: 'No Active Plan' })}>{plan?.name || t('no_active_plan', { defaultValue: 'No Active Plan' })}</h3>
              </div>
              <StatusBadge status={sub.status} />
            </div>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-3xl font-black text-title">${amountPaid.toFixed(2)}</span>
              <span className="text-base text-subtitle-color font-medium">/ {t('month', { defaultValue: 'month' })}</span>
            </div>
            <p className="text-md text-subtitle-color capitalize font-medium mt-1">{t(plan?.billing_cycle || '', { defaultValue: plan?.billing_cycle })} {t('billing', { defaultValue: 'Billing' })}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-input-border-color flex flex-col sm:flex-row sm:items-stretch justify-between gap-4 sm:gap-0 relative">
            <div className="flex items-center gap-2 flex-1">
              <Clock className="w-5 h-5 text-edit shrink-0" />
              <div>
                <p className="text-sm font-bold text-edit">
                  {plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime'
                    ? t('days_count', { count: (plan as any)?.validity_days || 0, defaultValue: '{{count}} Days Left' })
                    : t('days_count', { count: daysRemaining, defaultValue: '{{count}} Days Left' })}
                </p>
                <p className="text-sm text-subtitle-color font-medium">{t('until_next_renewal', { defaultValue: 'Until next renewal' })}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-input-border-color shrink-0 mx-2"></div>

            <div className="flex items-center gap-2 sm:justify-end justify-start sm:text-right text-left flex-1">
              <Calendar className="w-5 h-5 text-primary opacity-80 shrink-0 hidden sm:block" />
              <div>
                <p className="text-sm text-subtitle-color font-medium">{t('expires_on', { defaultValue: 'Expires on' })}</p>
                <p className="text-base font-bold text-title whitespace-nowrap">
                  {formatDate(sub.current_period_end)}
                </p>
              </div>
              <Calendar className="w-5 h-5 text-primary opacity-80 shrink-0 sm:hidden" />
            </div>
          </div>
        </div>

        {/* Card 2: Credits Usage */}
        <div className="flex h-full w-full">
          <UserAIFeatureUsage sub={sub} />
        </div>

        {/* Card 3: Billing Details */}
        <div className="bg-bg-card border border-input-border-color rounded-lg sm:p-6 p-4 flex flex-col justify-between col-span-1 lg:col-span-2 min-[1200px]:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-title text-lg">{t('billing_details', { defaultValue: 'Billing Details' })}</h3>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-sm">
              <div className="flex text-md items-center gap-2 text-subtitle-color font-medium">
                <Wallet className="w-4 h-4" />
                {t('amount_paid', { defaultValue: 'Amount Paid' })}
              </div>
              <span className="font-bold text-title">${amountPaid.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex text-md items-center gap-2 text-subtitle-color font-medium">
                <Calendar className="w-4 h-4" />
                {t('purchased_on', { defaultValue: 'Purchased On' })}
              </div>
              <span className="font-bold text-title">{formatDate(sub.current_period_start)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex text-md items-center gap-2 text-subtitle-color font-medium">
                <Calendar className="w-4 h-4" />
                {t('next_renewal', { defaultValue: 'Next Renewal' })}
              </div>
              <span className="font-bold text-title">{formatDate(sub.current_period_end)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex text-md items-center gap-2 text-subtitle-color font-medium">
                <RefreshCw className="w-4 h-4" />
                {t('billing_cycle', { defaultValue: 'Billing Cycle' })}
              </div>
              <span className="font-bold text-title capitalize">{t(plan?.billing_cycle || '', { defaultValue: plan?.billing_cycle })}</span>
            </div>
          </div>
        </div>
      </div>

      {sub.cancel_at_period_end && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/50 mt-4">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            {t('cancel_at_period_end_desc', {
              date: formatDate(sub.current_period_end),
            })}
          </p>
        </div>
      )}

      {sub.status === 'pending' && sub.payment_gateway === 'manual' && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-900/50 mt-4">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
            {t('manual_subscription_pending_desc', {
              defaultValue: 'Your manual payment is pending admin approval. You will gain access once it is approved.',
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default UserSubscriptionOverview
