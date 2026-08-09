'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useGetCreditStatisticsQuery, useGetCreditUsageHistoryQuery } from '@/redux/api/creditApi'
import { format } from 'date-fns'
import { ArrowDownRight, ArrowUpRight, Coins, PhoneCall, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CreditHistoryPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAdmin } = usePermission()
  const [page, setPage] = useState(1)
  const limit = 10

  const { data: statisticsResp, isLoading: statsLoading } = useGetCreditStatisticsQuery(undefined, { skip: isAdmin() })
  const { data: historyResp, isLoading: historyLoading } = useGetCreditUsageHistoryQuery({ page, limit }, { skip: isAdmin() })

  if (isAdmin()) {
    return (
      <div className="p-8 text-center text-zinc-500">
        {t('access_restricted_to_workspace_users')}
      </div>
    )
  }

  const statistics = statisticsResp?.data || {}
  const usageData = historyResp?.data?.data || []
  const pagination = historyResp?.data?.pagination

  const cards = useMemo(
    () => [
      {
        title: 'Remaining Credits',
        value: statistics.available_credits ?? 0,
        icon: Wallet,
        accent: 'text-violet-600 dark:text-violet-400',
        bgAccent: 'bg-violet-100 dark:bg-violet-500/20',
      },
      {
        title: 'Total Credits',
        value: statistics.total_credits ?? 0,
        icon: Coins,
        accent: 'text-indigo-600 dark:text-indigo-400',
        bgAccent: 'bg-indigo-100 dark:bg-indigo-500/20',
      },
      {
        title: 'This Month Usage',
        value: statistics.monthly_credits_used ?? 0,
        icon: Coins,
        accent: 'text-rose-600 dark:text-rose-400',
        bgAccent: 'bg-rose-100 dark:bg-rose-500/20',
      },
      {
        title: 'Completed Calls (Month)',
        value: statistics.total_completed_calls_this_month ?? 0,
        icon: PhoneCall,
        accent: 'text-emerald-600 dark:text-emerald-400',
        bgAccent: 'bg-emerald-100 dark:bg-emerald-500/20',
      },
    ],
    [statistics]
  )

  const columns: Column<any>[] = [
    {
      header: 'Date',
      accessorKey: 'created_at',
      className: 'min-w-[180px] text-muted-foreground',
      cell: (row) => (
        <span className="text-sm font-medium">
          {row.created_at ? format(new Date(row.created_at), 'dd MMM yyyy, hh:mm a') : '-'}
        </span>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'transaction_type',
      className: 'min-w-[160px]',
      cell: (row) => {
        const typeStr = String(row.transaction_type || '-').replaceAll('_', ' ')
        const isDeduction = typeStr.includes('deduct') || typeStr.includes('deduction')
        return (
          <Badge variant="outline" className={cn(
            "capitalize font-semibold border",
            isDeduction 
              ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" 
              : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
          )}>
            {typeStr}
          </Badge>
        )
      },
    },
    {
      header: 'Reference',
      accessorKey: 'reference_type',
      className: 'min-w-[130px]',
      cell: (row) => row.reference_type ? (
        <Badge variant="secondary" className="capitalize font-medium text-xs bg-muted text-muted-foreground">
          {String(row.reference_type).replaceAll('_', ' ')}
        </Badge>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      className: 'min-w-[260px] text-muted-foreground',
      cell: (row) => <span className="text-sm">{row.description || '-'}</span>,
    },
    {
      header: 'Credits',
      accessorKey: 'credits',
      className: 'min-w-[120px]',
      cell: (row) => {
        const value = Number(row.credits || 0)
        const isDeduction = value < 0
        return (
          <div className={cn(
            'flex items-center gap-1.5 font-bold text-sm', 
            isDeduction ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          )}>
            {isDeduction ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            <span>{value > 0 ? '+' : ''}{value}</span>
          </div>
        )
      },
    },
    {
      header: 'Balance After',
      accessorKey: 'balance_after',
      className: 'min-w-[130px]',
      cell: (row) => (
        <span className="font-bold text-title text-sm">
          {row.balance_after ?? 0}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-7">
      <PageHeader title="Credit History" showBackButton onBack={() => router.push(ROUTES.DASHBOARD)} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold text-subtitle-color">
                {card.title}
              </CardTitle>
              <div className={`w-9 h-9 flex justify-center items-center rounded-lg shrink-0 ${card.bgAccent}`}>
                <card.icon className={`w-5 h-5 ${card.accent}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight text-title">{statsLoading ? '...' : card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <PageHeader title="Credit Usage History" showBackButton={false} />
      <DataTable
        columns={columns}
        data={usageData}
        isLoading={historyLoading}
        emptyStateTitle={t("no_credit_history_title", "No Credit Usage Found")}
        emptyMessage={t("no_credit_history_desc", "Your credit consumption will be recorded here.")}
        currentPage={pagination?.current_page || page}
        totalPages={Math.max(1, pagination?.total_pages || 1)}
        totalResults={pagination?.total_records || 0}
        onPageChange={(nextPage) => setPage(nextPage)}
      />
    </div>
  )
}

export default CreditHistoryPage
