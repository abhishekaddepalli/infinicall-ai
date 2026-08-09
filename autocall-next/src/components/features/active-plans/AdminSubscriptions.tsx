'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PERMISSIONS } from '@/constants/permissions'
import { subscriptionStatus } from '@/data/subscription'
import { useAppDirection } from '@/hooks/useAppDirection'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useApproveManualSubscriptionMutation, useGetAllSubscriptionsQuery, useRejectManualSubscriptionMutation } from '@/redux/api/subscriptionApi'
import { Subscription } from '@/types/plans'
import { Column } from '@/types/table'
import { formatDate } from '@/utils/auth'
import { Check, CreditCard, Filter, Pen, User as UserIcon, X, Download } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AssignPlanModal from './AssignPlanModal'
import { StatusBadge } from './StatusBadge'
import SubscriptionStats from './SubscriptionStats'

const AdminSubscriptions = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SUBSCRIPTIONS)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const direction = useAppDirection()

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const { data: subscriptionsData, isLoading } = useGetAllSubscriptionsQuery({
    page,
    limit,
    search,
    status: statusFilter,
    sortBy: sortBy,
    sortOrder: sortOrder,
  })

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const [approveManual] = useApproveManualSubscriptionMutation()
  const [rejectManual] = useRejectManualSubscriptionMutation()

  const subscriptions = subscriptionsData?.data?.subscriptions || []
  const pagination = subscriptionsData?.data?.pagination

  const handleApprove = async (id: string) => {
    try {
      await approveManual(id).unwrap()
      toast.success(t('subscription_approved_success'))
    } catch (err: any) {
      toast.error(err?.data?.message || t('subscription_approved_error'))
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectManual(id).unwrap()
      toast.success(t('subscription_rejected_success'))
    } catch (err: any) {
      toast.error(err?.data?.message || t('subscription_rejected_error'))
    }
  }

  const handleEdit = (row: Subscription) => {
    setEditingSubscription(row)
    setIsAssignModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAssignModalOpen(false)
    setEditingSubscription(null)
  }

  const handleDownloadReceipt = async (receiptPath: string, userName: string) => {
    try {
      let relativePath = receiptPath
      const uploadsIndex = receiptPath.indexOf('uploads/')
      if (uploadsIndex !== -1) {
        relativePath = receiptPath.substring(uploadsIndex)
      } else {
        relativePath = receiptPath.replace(/^\/+/, '')
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api(\/v1)?\/?$/, '') || ''
      const url = `${baseUrl.replace(/\/+$/, '')}/${relativePath}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Network response was not ok')
      
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      
      // Extract extension from path
      const ext = receiptPath.split('.').pop() || 'png'
      link.download = `receipt_${userName.replace(/\s+/g, '_').toLowerCase()}.${ext}`
      
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed, falling back to new tab:', error)
      let relativePath = receiptPath
      const uploadsIndex = receiptPath.indexOf('uploads/')
      if (uploadsIndex !== -1) {
        relativePath = receiptPath.substring(uploadsIndex)
      } else {
        relativePath = receiptPath.replace(/^\/+/, '')
      }
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api(\/v1)?\/?$/, '') || ''
      window.open(`${baseUrl.replace(/\/+$/, '')}/${relativePath}`, '_blank')
    }
  }

  const columns: Column<Subscription>[] = [
    {
      header: t('user'),
      className: 'xl1199:min-w-[325px] min-w-[180px]',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
            {row.user?.avatar ? (
              <Image src={row.user.avatar} alt={row.user.name} width={40} height={40} unoptimized className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base truncate">{row.user?.name || t('unknown_user')}</span>
            {row.user?.email ? <CopyEmailCell email={row.user.email} /> : null}
          </div>
        </div>
      ),
    },
    {
      header: t('plan'),
      className: 'xl1199:min-w-[190px] min-w-[100px]',
      cell: (row: any) => (
        <div className="flex flex-col">
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold whitespace-nowrap w-fit">
            {row.plan?.name || t('unknown_plan')}
          </Badge>
          <span className="text-sm text-subtitle-color mt-1 capitalize">
            {t(row.plan?.billing_cycle)}
          </span>
        </div>
      ),
    },
    {
      header: t('amount'),
      className: 'xl1199:min-w-[180px] min-w-[130px]',
      sortable: true,
      sortKey: 'amount_paid',
      cell: (row: Subscription) => (
        <div className="font-medium text-sm text-title/60 whitespace-nowrap">
          {row.currency || 'USD'} {row.amount_paid || 0}
        </div>
      ),
    },
    {
      header: t('status'),
      className: 'xl1199:min-w-[150px] min-w-[100px]',
      sortable: true,
      sortKey: 'status',
      cell: (row: Subscription) => <StatusBadge status={row.status} />,
    },
    {
      header: t('gateway'),
      className: 'xl1199:min-w-[140px] min-w-[100px]',
      cell: (row: Subscription) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-title/80 capitalize text-md font-medium whitespace-nowrap">
            <CreditCard className="w-4 h-4 text-subtitle-color" />
            {row.payment_gateway?.replace('_', ' ')}
          </div>
          {row.payment_reference && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[100px]" title={row.payment_reference}>
              {row.payment_reference}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t('expiration'),
      className: 'xl1199:min-w-[170px] min-w-[120px]',
      sortable: true,
      sortKey: 'current_period_end',
      cell: (row: Subscription) => (
        <div className="text-md font-medium text-title/90 flex items-center gap-1.5 whitespace-nowrap">
          {row.current_period_end ? formatDate(row.current_period_end) : t('no_expiration')}
        </div>
      ),
    },
  ]

  const renderActions = (row: Subscription) => {
    const isManualPending = row.payment_gateway === 'manual' && row.status === 'pending'
    return (
      <div className="flex items-center gap-2">
        {isManualPending && canUpdate && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              onClick={() => handleApprove(row._id || row.id)}
              title={t('approve')}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all"
              onClick={() => handleReject(row._id || row.id)}
              title={t('reject')}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {row.payment_gateway === 'manual' && row.transaction_receipt && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
            onClick={() => handleDownloadReceipt(row.transaction_receipt as string, row.user?.name || 'unknown')}
            title={t('download_receipt', 'Download Receipt')}
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
     
        {canUpdate && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
            onClick={() => handleEdit(row)}
            title={t('update_subscription')}
          >
            <Pen className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  const columnsWithActions: Column<Subscription>[] = [
    ...columns,
    {
      header: t('action'),
      cell: (row: Subscription) => renderActions(row),
    }
  ]

  return (
    <div className="space-y-6">
      <TableLayout
        showBackButton={false}
        title={t('active_plans')}
        sortColumn={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        extraActions={
          <div className="flex items-center gap-3">
            <DropdownMenu dir={direction}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-10 px-4 rounded-lg transition-all duration-300 shadow-sm font-medium',
                    statusFilter
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-background border-border hover:bg-muted text-muted-foreground',
                  )}
                >
                  <Filter className={cn('w-4 h-4', statusFilter ? 'text-black' : 'text-muted-foreground')} />
                  {statusFilter ? t(statusFilter) : t('all_status')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-[8px] bg-white dark:bg-modal-bg-color">
                <DropdownMenuItem
                  onClick={() => setStatusFilter('')}
                  className="flex items-center justify-between"
                >
                  {t('all_status')}
                  {statusFilter === '' && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
                {subscriptionStatus.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className="flex items-center justify-between"
                  >
                    {t(s)}
                    {statusFilter === s && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setIsAssignModalOpen(true)}
              className="rounded-lg h-10 px-6 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
            >
              {t('assign_plan')}
            </Button>

          </div>
        }
        columns={columnsWithActions}
        data={subscriptions}
        currentPage={page}
        totalPages={pagination?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyStateTitle={t("no_subscriptions_title", "No Recurring Plans Found")}
        emptyMessage={t("no_subscriptions_desc", "Assign billing plans or monitor upcoming renewals here.")}
        emptyStateActionLabel={t('assign_plan')}
        onEmptyStateAction={() => setIsAssignModalOpen(true)}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_subscriptions')}
      >
        <SubscriptionStats statsData={(subscriptionsData?.data as any)?.stats} />
      </TableLayout>

      <AssignPlanModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseModal}
        editingSubscription={editingSubscription}
      />
    </div>
  )
}

export default AdminSubscriptions
