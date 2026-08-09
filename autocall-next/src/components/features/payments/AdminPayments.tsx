'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { useGetAllPaymentsQuery } from '@/redux/api/subscriptionApi'
import { Column } from '@/types/table'
import { formatDate } from '@/utils/auth'
import { Check, CreditCard, Filter, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const AdminPayments = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const direction = useAppDirection()

  const { data: paymentsData, isLoading } = useGetAllPaymentsQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
    sortBy: sortColumn,
    sortOrder: sortOrder,
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const payments = paymentsData?.data || []
  const pagination = paymentsData?.pagination

  const columns: Column<any>[] = [
    {
      header: t('invoice_id'),
      accessorKey: 'invoice_number',
      sortable: true,
      className: 'xl1580:min-w-[295px] min-w-[150px]',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <span className=" text-sm text-title truncate">{row.invoice_number || '—'}</span>
        </div>
      ),
    },
    {
      header: t('user'),
      className: 'xl1580:min-w-[250px] min-w-[180px]',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {row.user?.avatar ? (
              <Image
                src={row.user.avatar}
                alt={row.user.name}
                width={100}
                height={100}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate">{row.user_id?.name || t('unknown_user')}</span>
            {row.user_id?.email ? <CopyEmailCell email={row.user_id.email} /> : null}
          </div>
        </div>
      ),
    },
    {
      header: t('plan'),
      className: 'xl1580:min-w-[180px] min-w-[100px]',
      cell: (row: any) => (
        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold whitespace-nowrap">
          {row.plan_id?.name || row.plan?.name || t('plan')}
        </Badge>
      ),
    },
    {
      header: t('amount'),
      accessorKey: 'amount',
      sortable: true,
      className: 'xl1580:min-w-[160px] min-w-[100px]',
      cell: (row: any) => (
        <div className="font-bold text-sm whitespace-nowrap">
          {row.currency === 'INR' ? '₹' : '$'}
          {row.total_amount || row.amount}
        </div>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'payment_status',
      sortable: true,
      className: 'xl1580:min-w-[150px] min-w-[100px]',
      cell: (row: any) => {
        const status = row.payment_status?.toLowerCase()
        let styles = 'bg-gray-100 text-gray-700 border-gray-200'
        let dotColor = 'bg-gray-500'

        if (status === 'completed' || status === 'succeeded' || status === 'success') {
          styles =
            'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
          dotColor = 'bg-emerald-500'
        } else if (status === 'pending') {
          styles =
            'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
          dotColor = 'bg-amber-500'
        } else if (status === 'failed' || status === 'cancelled') {
          styles =
            'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
          dotColor = 'bg-rose-500'
        }

        return (
          <Badge className={cn('gap-1.5 px-3 font-semibold rounded-full border shadow-none capitalize', styles)}>
            {row.payment_status}
          </Badge>
        )
      },
    },
    {
      header: t('gateway'),
      className: 'xl1580:min-w-[140px] min-w-[100px]',
      cell: (row: any) => (
        <div className="flex items-center gap-2 text-muted-foreground capitalize text-sm font-medium whitespace-nowrap">
          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
          {row.payment_gateway}
        </div>
      ),
    },
    {
      header: t('date'),
      accessorKey: 'created_at',
      sortable: true,
      className: 'xl1580:min-w-[160px] min-w-[120px]',
      cell: (row: any) => (
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
          {formatDate(row.created_at)}
        </div>
      ),
    },
  ]

  return (
    <React.Fragment>
      <TableLayout
        showBackButton={false}
        title={t('payment_history')}
        extraActions={
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4 rounded-lg bg-background border-border hover:bg-muted text-muted-foreground shadow-sm font-medium transition-all">
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter ? t(statusFilter) : t('all_status')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-[8px] bg-white dark:bg-modal-bg-color">
              {['', 'success', 'pending', 'failed'].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer focus:bg-muted rounded-md"
                >
                  {s ? t(s) : t('all_status')}
                  {statusFilter === s && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
        columns={columns}
        data={payments}
        totalResults={pagination?.total || 0}
        currentPage={page}
        totalPages={pagination?.totalPages || pagination?.total_pages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_payments_title", "No Payments Found")}
        emptyMessage={t("no_payments_desc", "Successful and pending payment invoices will automatically populate here.")}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_transactions')}

      />
    </React.Fragment>
  )
}

export default AdminPayments
