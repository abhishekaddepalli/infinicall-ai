'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { Button } from '@/components/ui/button'
import { subscription_history_filters } from '@/data/subscription'
import { cn } from '@/lib/utils'
import { HistoryRow, SubscriptionHistoryProps } from '@/types/plans'
import { formatDate } from '@/utils/auth'
import { HistoryStatusBadge } from './StatusBadge'

const SubscriptionHistory = ({
  filteredHistory,
  historyFilter,
  setHistoryFilter,
  sub,
  t,
  isLoading = false,
  pagination,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}: SubscriptionHistoryProps) => {
  const columns: Column<HistoryRow>[] = [
    {
      header: t('plan'),
      accessorKey: 'plan',
      className: 'font-semibold text-foreground truncate max-w-[200px] min-w-[150px]',
    },

    {
      header: t('billing_cycle'),
      accessorKey: 'billing_cycle',
      className: 'text-muted-foreground min-w-[120px]',
      cell: (row) => t(row.billing_cycle),
    },
    {
      header: t('amount'),
      accessorKey: 'amount',
      className: 'font-semibold text-foreground whitespace-nowrap min-w-[100px]',
      cell: (row) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: t('status'),
      accessorKey: 'status',
      className: 'min-w-[130px]',
      cell: (row) => <HistoryStatusBadge status={row.status} isCanceled={row.cancel_at_period_end} />,
    },
    {
      header: t('subscription_date'),
      accessorKey: 'subscription_date',
      className: 'text-muted-foreground whitespace-nowrap min-w-[150px]',
      cell: (row) => formatDate(row.subscription_date),
    },
    {
      header: t('expiry_date'),
      accessorKey: 'expiry_date',
      className: 'text-muted-foreground whitespace-nowrap min-w-[150px]',
      cell: (row) => formatDate(row.expiry_date),
    },
  ]

  return (
    <div className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden mt-8">
      <div className="sm:px-6 px-4 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-title">{t('subscription_history', { defaultValue: 'Subscription History' })}</h2>
          <p className="text-sm text-subtitle-color mt-1">{t('past_subscriptions', { defaultValue: 'Your past subscriptions' })}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {subscription_history_filters.map((f) => (
            <Button
              key={f}
              onClick={() => setHistoryFilter(f as any)}
              className={cn(
                'px-5 py-1.5 h-9 rounded-full text-sm font-bold transition-all border border-input-border-color shadow-none',
                historyFilter === f
                  ? 'bg-primary text-white border-primary hover:bg-primary/90'
                  : 'bg-transparent text-subtitle-color hover:bg-muted',
              )}
            >
              {t(f, { defaultValue: f.charAt(0).toUpperCase() + f.slice(1) })}
            </Button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredHistory}
        emptyStateTitle={t("no_subscription_history_title")}
        emptyMessage={t("no_subscription_history_desc")}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={pagination?.totalPages || 1}
        totalResults={pagination?.total || 0}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  )
}

export default SubscriptionHistory
