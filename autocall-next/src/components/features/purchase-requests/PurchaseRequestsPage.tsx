'use client'

import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAllPurchaseRequestsQuery, useVerifyPurchaseRequestMutation } from '@/redux/api/numberPurchaseApi'
import { NumberPurchaseRequest } from '@/types/number-purchase'
import { Column } from '@/types/table'
import { CheckCircle2, Clock, Eye, ShieldCheck, ShoppingCart, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import VerifyRequestModal from './VerifyRequestModal'

export default function PurchaseRequestsPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_ADMIN_DASHBOARD)
  const canVerify = hasPermission(PERMISSIONS.VIEW_ADMIN_DASHBOARD)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 0)
    return () => clearTimeout(timer)
  }, [debouncedSearch])

  const [selectedRequest, setSelectedRequest] = useState<NumberPurchaseRequest | null>(null)

  const { data: requestsData, isLoading, isFetching } = useGetAllPurchaseRequestsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sortColumn,
    sortOrder: sortOrder,
  }, {
    skip: !canView,
  })

  const [verifyRequest, { isLoading: isVerifying }] = useVerifyPurchaseRequestMutation()

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-bold text-title">{t('access_denied')}</p>
        <p className="text-sm text-subtitle-color mt-2">
          {t('no_permission_purchase_requests', 'You do not have permission to view purchase requests.')}
        </p>
      </div>
    )
  }

  const allRequests = requestsData?.data || []

  const totalItems = (requestsData as any)?.pagination?.total || requestsData?.total || 0
  const totalPages = (requestsData as any)?.pagination?.pages || (requestsData as any)?.totalPages || Math.ceil(totalItems / limit) || 1

  const handleVerify = async (data: { id: string; status: 'approved' | 'rejected'; reason?: string }) => {
    try {
      const res = await verifyRequest(data).unwrap()
      toast.success(res.message || t('verification_success', 'Request successfully verified.'))
      setSelectedRequest(null)
    } catch (error: any) {
      toast.error(error?.data?.message || t('verification_failed', 'Failed to verify request.'))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return (
          <div className="flex items-center gap-1.5 text-edit bg-edit/10 px-2.5 py-1 rounded-full border border-edit/20 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{t(status)}</span>
          </div>
        )
      case 'pending':
      case 'under_review':
        return (
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{t(status)}</span>
          </div>
        )
      case 'rejected':
      case 'failed':
        return (
          <div className="flex items-center gap-1.5 text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20 w-fit">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{t(status)}</span>
          </div>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDisplayKycStatus = (req: NumberPurchaseRequest) => {
    return req.kyc_status || 'pending';
  };

  const columns: Column<NumberPurchaseRequest>[] = [
    {
      header: t('user', 'User'),
      className: "xl1199:min-w-[250px] ",
      cell: (row) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-base text-title truncate">
            {(row.user_id as any)?.first_name} {(row.user_id as any)?.last_name}
          </span>
          <span className="text-md text-subtitle-color break-all whitespace-normal line-clamp-1">{(row.user_id as any)?.email}</span>
        </div>
      ),
    },
    {
      header: t('phone_number'),
      className: "xl1199:min-w-[220px] ",
      cell: (row) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-base text-title">{(row.phone_number_id as any)?.phone_number}</span>
          <span className="text-md text-primary font-bold">${row.amount?.toFixed(2)}</span>
        </div>
      ),
    },
    {
      header: t('date', 'Date'),
      className: "xl1199:min-w-[180px] ",
      accessorKey: 'created_at',
      sortable: true,
      cell: (row) => (
        <span className="text-md font-medium text-subtitle-color">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: t('payment', 'Payment'),
      className: "xl1199:min-w-[150px] ",
      accessorKey: 'payment_status',
      sortable: true,
      cell: (row) => getStatusBadge(row.payment_status),
    },
    {
      header: t('kyc_status', 'KYC Status'),
      className: "xl1199:min-w-[150px] ",
      accessorKey: 'kyc_status',
      sortable: true,
      cell: (row) => getStatusBadge(getDisplayKycStatus(row)),
    },
    {
      header: t('actions'),
      className: "xl1199:min-w-[150px] ",
      cell: (row) => {
        const displayStatus = getDisplayKycStatus(row);
        return (
          <div className="flex items-center justify-start gap-2">
            {canVerify && row.payment_status === 'paid' && (displayStatus === 'under_review' || displayStatus === 'pending') && (
              <Button
                size="sm"
                onClick={() => setSelectedRequest(row)}
                className="rounded-lg h-9 font-bold  p-padding! bg-primary/10 border text-primary hover:bg-primary hover:text-white"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                {t('verify', 'Verify')}
              </Button>
            )}
            {displayStatus !== 'under_review' && displayStatus !== 'pending' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedRequest(row)}
                className="h-9 w-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <TableLayout
        title={t('purchase_requests', 'Purchase Requests')}
        headerIcon={<ShoppingCart className="w-8 h-8 text-primary" />}
        columns={columns}
        data={allRequests}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_requests', 'Search by user or phone number...')}
        emptyStateTitle={t("no_requests_title", "No Purchase Requests")}
        emptyMessage={t("no_requests_desc", "There are currently no phone number purchase requests to review.")}
        totalResults={totalItems}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        showBackButton={false}
      />

      <VerifyRequestModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onSubmit={handleVerify}
        isLoading={isVerifying}
      />
    </>
  )
}
