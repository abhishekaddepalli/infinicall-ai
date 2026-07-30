'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import {
  useCancelSubscriptionMutation,
  useGetMyPaymentHistoryQuery,
  useGetUserSubscriptionQuery,
} from '@/redux/api/subscriptionApi'
import { ApiError } from '@/types/api'
import { Payment } from '@/types/plans'
import { differenceInDays } from 'date-fns'
import { Package } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import SubscriptionHistory from './SubscriptionHistory'
import UserSubscriptionOverview from './UserSubscriptionOverview'

const UserSubscription = () => {
  const { t } = useTranslation()
  const { data: subscriptionResp, isLoading } = useGetUserSubscriptionQuery()
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation()
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [historyFilter, setHistoryFilter] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: paymentHistoryResp, isLoading: isHistoryLoading } = useGetMyPaymentHistoryQuery({ limit: 1000 })

  const subRaw = subscriptionResp?.data
  const sub = subRaw?.status === 'incomplete' ? null : subRaw

  const handleCancel = async () => {
    const subId = sub?.id || (sub as any)?._id
    if (!subId) return
    try {
      await cancelSubscription(subId).unwrap()
      toast.success(t('subscription_cancelled_successfully'))
      setIsCancelDialogOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in">
        <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 shadow-sm border border-primary/20">
          <Package className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          {t('no_active_subscription')}
        </h2>
        <p className="text-muted-foreground max-w-md text-base">
          {t('no_subscription_desc')}
        </p>
        <Button className="sm:h-12 h-10 px-6 rounded-lg font-bold text-base shadow-sm transition-colors" asChild>
          <Link href={ROUTES.PLANS}>{t('view_plans')}</Link>
        </Button>
      </div>
    )
  }

  const daysRemaining =
    sub.days_remaining ??
    (sub.current_period_end ? Math.max(0, differenceInDays(new Date(sub.current_period_end), new Date())) : 0)

  const amountPaid = sub.amount_paid || sub.amount || 0

  // Map Payment[] from the dedicated payments API to HistoryRow[]
  const payments: Payment[] = paymentHistoryResp?.data || []
  const historyRows = payments.map((p: Payment) => ({
    plan: (p as any).plan?.name || (typeof p.plan_id === 'object' ? (p.plan_id as any)?.name : null) || t('unknown_plan'),
    members: 1,
    billing_cycle: (p as any).plan?.billing_cycle || (typeof p.plan_id === 'object' ? (p.plan_id as any)?.billing_cycle : null) || 'monthly',
    amount: p.amount || 0,
    status: p.payment_status === 'success' ? 'active' : p.payment_status === 'failed' ? 'expired' : p.payment_status,
    subscription_date: p.paid_at || p.created_at,
    expiry_date: (p as any).subscription_id?.expires_at || (p as any).subscription_id?.current_period_end || null,
    cancel_at_period_end: false,
  }))

  const filteredHistory = historyRows.filter((row: any) => {
    if (historyFilter === 'all') return true
    if (historyFilter === 'active') return row.status === 'active'
    if (historyFilter === 'expired') return row.status === 'expired' || row.status === 'failed' || row.status === 'pending'
    if (historyFilter === 'cancelled') return row.status === 'cancelled' || row.status === 'refunded'
    return true
  })

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="pt-0! py-8 space-y-6 animate-in fade-in duration-700">
      <UserSubscriptionOverview
        sub={sub}
        amountPaid={amountPaid}
        daysRemaining={daysRemaining}
        isCancelDialogOpen={isCancelDialogOpen}
        setIsCancelDialogOpen={setIsCancelDialogOpen}
        handleCancel={handleCancel}
        isCancelling={isCancelling}
        t={t}
      />

      <SubscriptionHistory
        filteredHistory={paginatedHistory}
        historyFilter={historyFilter}
        setHistoryFilter={(filter) => {
          setHistoryFilter(filter)
          setCurrentPage(1)
        }}
        sub={sub}
        t={t}
        isLoading={isHistoryLoading}
        pagination={{ total: filteredHistory.length, totalPages: Math.ceil(filteredHistory.length / rowsPerPage) }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  )
}

export default UserSubscription
