'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useDeletePhoneNumberMutation,
  useGetPhoneNumbersQuery,
  useImportSipPhoneNumberMutation,
  useLoadFromPlivoMutation,
  useLoadFromTwilioMutation,
  useLoadFromVobizMutation,
  useSyncToElevenLabsMutation,
  useUpdatePhoneNumberMutation,
  useUpdatePurchasePriceMutation,
} from '@/redux/api/phoneNumberApi'
import { PhoneNumber } from '@/types/phone-number'
import { Column } from '@/types/table'
import {
  Bot,
  CheckCircle2,
  CloudDownload,
  DollarSign,
  Phone,
  RefreshCw,
  Server,
  ShoppingCart,
  Trash2
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PurchaseNumbersModal from '../purchase-numbers/PurchaseNumbersModal'
import AssignAgentModal from './AssignAgentModal'
import AssignPriceModal from './AssignPriceModal'
import AssignSipModal from './AssignSipModal'
import SipImportModal from './SipImportModal'

const PhoneNumberPage = () => {
  const { t } = useTranslation()
  const { hasPermission, isAdmin } = usePermission()

  const canView = hasPermission(PERMISSIONS.VIEW_PHONE_NUMBERS)
  const canCreatePhone = hasPermission(PERMISSIONS.CREATE_PHONE_NUMBERS)
  const canUpdatePhone = hasPermission(PERMISSIONS.UPDATE_PHONE_NUMBERS)
  const canDeletePhone = hasPermission(PERMISSIONS.DELETE_PHONE_NUMBERS)
  const canUpdatePurchasePrice = hasPermission(PERMISSIONS.UPDATE_PURCHASE_PRICE)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)
  const [isSipImportOpen, setIsSipImportOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [assignSipNumber, setAssignSipNumber] = useState<PhoneNumber | null>(null)
  const [assignAgentNumber, setAssignAgentNumber] = useState<PhoneNumber | null>(null)
  const [assignPriceNumber, setAssignPriceNumber] = useState<PhoneNumber | null>(null)
  const [syncingRowId, setSyncingRowId] = useState<string | null>(null)

  const { data: numbersData, isLoading, isFetching } = useGetPhoneNumbersQuery(
    { search, page, limit, sortBy: sortColumn, sortOrder: sortOrder },
    { skip: !canView },
  )

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }
  const [deleteNumber, { isLoading: isDeleting }] = useDeletePhoneNumberMutation()
  const [loadTwilio, { isLoading: isLoadingTwilio }] = useLoadFromTwilioMutation()
  const [loadPlivo, { isLoading: isLoadingPlivo }] = useLoadFromPlivoMutation()
  const [loadVobiz, { isLoading: isLoadingVobiz }] = useLoadFromVobizMutation()
  const [syncElevenLabs, { isLoading: isSyncingElevenLabs }] = useSyncToElevenLabsMutation()
  const [importSip, { isLoading: isImportingSip }] = useImportSipPhoneNumberMutation()
  const [updatePhoneNumber, { isLoading: isAssigningSip }] = useUpdatePhoneNumberMutation()
  const [updatePurchasePrice, { isLoading: isAssigningPrice }] = useUpdatePurchasePriceMutation()
  const [updatePhoneNumberForAgent, { isLoading: isAssigningAgent }] = useUpdatePhoneNumberMutation()

  const handleDelete = async () => {
    if (!selectedNumber) return
    try {
      const id = selectedNumber._id || selectedNumber.id
      await deleteNumber(id).unwrap()
      toast.success(t('number_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setSelectedNumber(null)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('delete_failed'))
    }
  }

  const handleLoadTwilio = async () => {
    try {
      const res = await loadTwilio().unwrap()
      toast.success(res.message || t('twilio_sync_success'))
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('twilio_sync_failed'))
    }
  }

  const handleLoadPlivo = async () => {
    try {
      const res = await loadPlivo().unwrap()
      toast.success(res.message || t('plivo_sync_success', 'Plivo sync successful'))
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('plivo_sync_failed', 'Plivo sync failed'))
    }
  }

  const handleLoadVobiz = async () => {
    try {
      const res = await loadVobiz().unwrap()
      toast.success(res.message || t('vobiz_sync_success', 'Vobiz sync successful'))
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('vobiz_sync_failed', 'Vobiz sync failed'))
    }
  }

  const handleSyncElevenLabs = async (num: PhoneNumber) => {
    try {
      const id = num._id || num.id
      setSyncingRowId(id)
      await syncElevenLabs(id).unwrap()
      toast.success(t('synced_to_elevenlabs_success'))
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('sync_failed'))
    } finally {
      setSyncingRowId(null)
    }
  }

  const handleSipImport = async (values: {
    phone_number: string
    sip_trunk_id: string
    label?: string
  }) => {
    try {
      const res = await importSip(values).unwrap()
      toast.success(res.message || t('sip_import_success'))
      setIsSipImportOpen(false)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('sip_import_failed'))
      throw error
    }
  }

  const handleAssignSip = async ({ sip_trunk_id }: { sip_trunk_id: string }) => {
    if (!assignSipNumber) return

    const id = assignSipNumber._id || assignSipNumber.id
    try {
      const res = await updatePhoneNumber({
        id,
        data: {
          type: 'sip',
          provider: 'sip',
          sip_trunk_id,
        },
      }).unwrap()
      toast.success(res.message || t('assign_sip_success'))
      setAssignSipNumber(null)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('assign_sip_failed'))
      throw error
    }
  }

  const handleAssignPrice = async ({ purchase_price, validity_days }: { purchase_price: number; validity_days: number }) => {
    if (!assignPriceNumber) return

    const id = assignPriceNumber._id || assignPriceNumber.id
    try {
      const res = await updatePurchasePrice({
        id,
        data: { purchase_price, validity_days },
      }).unwrap()
      toast.success(res.message || t('assign_price_success'))
      setAssignPriceNumber(null)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('assign_price_failed'))
      throw error
    }
  }

  const handleAssignAgent = async ({ agent_id }: { agent_id: string | null }) => {
    if (!assignAgentNumber) return

    const id = assignAgentNumber._id || assignAgentNumber.id

    // Resolve the current assigned agent id (may be a populated object or raw string)
    const currentAgentId: string | null = (() => {
      if (!assignAgentNumber.agent_id) return null
      if (typeof assignAgentNumber.agent_id === 'object') {
        return assignAgentNumber.agent_id._id ?? assignAgentNumber.agent_id.id ?? null
      }
      return assignAgentNumber.agent_id
    })()

    try {
      if (currentAgentId && agent_id && currentAgentId !== agent_id) {
        await updatePhoneNumberForAgent({ id, data: { remove_agent: true } }).unwrap()
      }

      if (agent_id) {
        const res = await updatePhoneNumberForAgent({ id, data: { agent_id } }).unwrap()
        toast.success(
          res.message || t('assign_agent_success'),
        )
      } else {
        const res = await updatePhoneNumberForAgent({ id, data: { remove_agent: true } }).unwrap()
        toast.success(
          res.message || t('remove_agent_success'),
        )
      }

      setAssignAgentNumber(null)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(
        err?.data?.message || t('assign_agent_failed'),
      )
      throw error
    }
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-bold text-title">{t('access_denied')}</p>
        <p className="text-sm text-subtitle-color mt-2">
          {t('no_permission_phone_numbers', {
            defaultValue: 'You do not have permission to view voice numbers.',
          })}
        </p>
      </div>
    )
  }

  const columns: Column<PhoneNumber>[] = [
    {
      header: t('phone_number'),
      accessorKey: 'phone_number',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base text-title truncate">{row.phone_number}</span>
            <span className="text-md text-subtitle-color font-medium truncate">{row.sid}</span>
          </div>
        </div>
      ),
    },
    {
      header: t('type'),
      accessorKey: 'type',
      sortable: true,
      cell: (row) => (
        <Badge
          variant="outline"
          className={cn(
            'font-black text-sm px-3 py-1 rounded-full',
            row.type === 'sip' && 'bg-primary/10 text-primary border-primary/20',
            row.type === 'verified' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
            row.type === 'purchased' && 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-500',
            !['sip', 'verified', 'purchased'].includes(row.type || '') && 'bg-subcard border-input-border-color text-subtitle-color'
          )}
        >
          {t(row.type)}
        </Badge>
      ),
    },
    {
      header: t('linked_agent'),
      cell: (row) => (
        <div className="flex flex-col gap-1">
          {row.agent_id ? (
            <span className="text-sm font-bold text-title tracking-tight">
              {typeof row.agent_id === 'object' ? row.agent_id.name : row.agent_id}
            </span>
          ) : (
            <span className="text-md font-medium text-subtitle-color">{t('not_assigned')}</span>
          )}
        </div>
      ),
    },
    {
      header: t('elevenlabs'),
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.is_synced_to_elevenlabs ? (
            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{t('synced')}</span>
            </div>
          ) : (
            canUpdatePhone && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSyncElevenLabs(row)}
                disabled={isSyncingElevenLabs && syncingRowId === (row._id || row.id)}
                className="h-8 rounded-full bg-primary/10 text-primary dark:bg-white/5 border-input-border-color text-sm font-black gap-1.5 hover:bg-primary hover:text-white transition-all"
              >
                <RefreshCw className={cn('w-3 h-3', isSyncingElevenLabs && syncingRowId === (row._id || row.id) && 'animate-spin')} />
                {t('sync_now')}
              </Button>
            )
          )}
        </div>
      ),
    },
    {
      header: t('price', 'Price'),
      accessorKey: 'purchase_price',
      sortable: true,
      cell: (row) => (
        <div className="font-bold text-sm text-title">
          {row.purchase_price ? `$${row.purchase_price.toFixed(2)}` : '-'}
        </div>
      ),
    },
    {
      header: t('provider', 'Provider'),
      accessorKey: 'provider',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.provider ? (
            <Badge variant="outline" className="font-bold uppercase tracking-wider text-[10px] bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
              {row.provider}
            </Badge>
          ) : (
            <span className="text-sm font-medium text-subtitle-color">-</span>
          )}
        </div>
      ),
    },
    {
      header: t('actions'),
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-start gap-2">
          {canUpdatePurchasePrice && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAssignPriceNumber(row)}
              className="h-9 w-9 rounded-lg text-amber-600 bg-amber-600/10 font-bold text-xs hover:bg-amber-600 hover:text-white"
              title={t('assign_price', 'Assign Price')}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
          {canUpdatePhone && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAssignSipNumber(row)}
              className="h-9 w-9 rounded-lg text-primary bg-primary/10 font-bold text-xs hover:bg-primary hover:text-white"
              title={t('assign_sip')}
            >
              <Server className="h-4 w-4" />
            </Button>
          )}
          {canUpdatePhone && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAssignAgentNumber(row)}
              className="h-9 w-9 rounded-lg hover:bg-edit hover:text-white bg-edit/10 text-edit font-bold text-xs hover:bg-edit hover:text-white"
              title={t('assign_agent')}
            >
              <Bot className="h-4 w-4" />
            </Button>
          )}
          {canDeletePhone && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedNumber(row)
                setIsDeleteModalOpen(true)
              }}
              className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
              title={t('delete')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <TableLayout
        title={t('phone_numbers')}
        headerIcon={<Phone className="w-8 h-8 text-primary" />}
        endContent={
          <div className="flex flex-wrap items-center gap-2">
            {!isAdmin() && canCreatePhone && (
              <Button
                onClick={() => setIsPurchaseModalOpen(true)}
                variant="outline"
                className="h-12 p-padding! rounded-radius bg-primary/10 border-none hover:bg-primary! hover:text-white text-primary font-black text-sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('buy_now', 'Buy Now')}
              </Button>
            )}
            {canCreatePhone && (
              <Button
                onClick={() => setIsSipImportOpen(true)}
                variant="outline"
                className="h-12 p-padding! rounded-radius bg-primary/10 border-none hover:bg-primary! hover:text-white text-primary font-black text-sm"
              >
                <Server className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('import')}
              </Button>
            )}
            {canCreatePhone && (
              <Button
                onClick={handleLoadTwilio}
                disabled={isLoadingTwilio}
                variant="outline"
                className="h-12 gap-2 p-padding! rounded-radius bg-primary font-black text-sm text-white transition-all border-none"
              >
                {isLoadingTwilio ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CloudDownload className="w-4 h-4" />
                )}
                {isLoadingTwilio ? t('loading_twilio') : t('sync_from_twilio')}
              </Button>
            )}
            {canCreatePhone && (
              <Button
                onClick={handleLoadPlivo}
                disabled={isLoadingPlivo}
                variant="outline"
                className="h-12 gap-2 p-padding! rounded-radius bg-primary font-black text-sm text-white transition-all border-none"
              >
                {isLoadingPlivo ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CloudDownload className="w-4 h-4" />
                )}
                {isLoadingPlivo ? t('loading_plivo', 'Loading...') : t('sync_from_plivo', 'Sync from Plivo')}
              </Button>
            )}
            {canCreatePhone && (
              <Button
                onClick={handleLoadVobiz}
                disabled={isLoadingVobiz}
                variant="outline"
                className="h-12 gap-2 p-padding! rounded-radius bg-primary font-black text-sm text-white transition-all border-none"
              >
                {isLoadingVobiz ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CloudDownload className="w-4 h-4" />
                )}
                {isLoadingVobiz ? t('loading_vobiz', 'Loading...') : t('sync_from_vobiz', 'Sync from Vobiz')}
              </Button>
            )}
          </div>
        }
        columns={columns}
        data={numbersData?.data?.slice((page - 1) * limit, page * limit) || []}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_numbers')}
        emptyStateTitle={t("no_numbers_title", "No Phone Numbers Found")}
        emptyMessage={t("no_numbers_desc", "Import SIP trunks or Twilio numbers to enable voice call routing.")}
        emptyStateActionLabel={t('import')}
        onEmptyStateAction={canCreatePhone ? () => setIsSipImportOpen(true) : undefined}
        totalResults={numbersData?.total || numbersData?.data?.length || 0}
        currentPage={page}
        totalPages={Math.ceil((numbersData?.total || numbersData?.data?.length || 0) / limit) || 1}
        onPageChange={setPage}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1); }}
        showRowsPerPageAtTop={true}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        showBackButton={false}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedNumber(null)
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t('delete_number_title')}
        description={t('delete_number_warning')}
      />

      <SipImportModal
        isOpen={isSipImportOpen}
        onClose={() => setIsSipImportOpen(false)}
        onSubmit={handleSipImport}
        isLoading={isImportingSip}
      />

      <AssignSipModal
        isOpen={!!assignSipNumber}
        onClose={() => setAssignSipNumber(null)}
        phoneNumber={assignSipNumber}
        onSubmit={handleAssignSip}
        isLoading={isAssigningSip}
      />

      <AssignAgentModal
        isOpen={!!assignAgentNumber}
        onClose={() => setAssignAgentNumber(null)}
        phoneNumber={assignAgentNumber}
        onSubmit={handleAssignAgent}
        isLoading={isAssigningAgent}
      />

      <AssignPriceModal
        isOpen={!!assignPriceNumber}
        onClose={() => setAssignPriceNumber(null)}
        phoneNumber={assignPriceNumber}
        onSubmit={handleAssignPrice}
        isLoading={isAssigningPrice}
      />

      <PurchaseNumbersModal 
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </>
  )
}

export default PhoneNumberPage
