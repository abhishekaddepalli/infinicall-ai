'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  useGetMetaTemplatesListQuery,
  useSyncTemplatesMutation,
} from '@/redux/api/whatsappTemplateApi'
import { MetaTemplate, SyncTemplatesModalProps } from '@/types/waba'
import { AlertCircle, RefreshCw, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function SyncTemplatesModal({
  isOpen,
  onClose,
  wabaId,
  onSyncSuccess,
}: SyncTemplatesModalProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 1. Fetch WABA templates list from Meta
  const {
    data: metaResponse,
    isLoading: isLoadingMeta,
    isFetching: isFetchingMeta,
    refetch,
    error,
  } = useGetMetaTemplatesListQuery(
    { waba_id: wabaId },
    { skip: !isOpen || !wabaId, refetchOnMountOrArgChange: true }
  )

  const [syncTemplates, { isLoading: isSyncing }] = useSyncTemplatesMutation()

  const metaTemplates: MetaTemplate[] = useMemo(() => {
    return metaResponse?.data || []
  }, [metaResponse])

  // Reset selected templates on open or connection changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSelectedIds([])
        setSearchQuery('')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, wabaId])

  // Filter templates list by search query
  const filteredTemplates = useMemo(() => {
    return metaTemplates.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [metaTemplates, searchQuery])

  // Handle select all checkbox toggle
  const isAllSelected = useMemo(() => {
    if (filteredTemplates.length === 0) return false
    return filteredTemplates.every((item) => selectedIds.includes(item.id))
  }, [filteredTemplates, selectedIds])

  const handleToggleAll = () => {
    if (isAllSelected) {
      // Remove all filtered IDs from selection
      const filteredIds = filteredTemplates.map((item) => item.id)
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)))
    } else {
      // Add all filtered IDs to selection
      const filteredIds = filteredTemplates.map((item) => item.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])))
    }
  }

  const handleToggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSync = async () => {
    if (selectedIds.length === 0) return

    try {
      await syncTemplates({
        waba_id: wabaId,
        meta_template_ids: selectedIds,
      }).unwrap()

      toast.success(
        t('sync_success_toast', {
          defaultValue: `Successfully synchronized ${selectedIds.length} WhatsApp templates!`,
        })
      )
      if (onSyncSuccess) onSyncSuccess()
      onClose()
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        t('sync_failed_toast', {
          defaultValue: 'Failed to synchronize templates from Meta. Please try again.',
        })
      )
    }
  }

  // Get status color styling
  const getStatusBadgeStyle = (status: string) => {
    const s = status.toUpperCase()
    if (s === 'APPROVED') {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    }
    if (s === 'REJECTED') {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    }
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! w-[95vw] border-none rounded-modal-radius bg-bg-card sm:p-6 p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-auto no-scrollbar">

        {/* Modal Header */}
        <DialogHeader className="relative pr-8 pb-3 m-0! border-b border-input-border-color">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-left rtl:text-right font-black text-title tracking-tight">
                {t('sync_templates_meta_title')}
              </DialogTitle>
              <DialogDescription className="text-md text-left rtl:text-right text-subtitle-color font-semibold leading-none mt-1">
                {t('sync_templates_meta_subtitle')}
              </DialogDescription>
            </div>

            {/* Sync Refresh Button */}
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoadingMeta || isFetchingMeta || !wabaId}
              onClick={() => refetch()}
              className="h-9 w-9 rounded-lg border border-input-border-color text-subtitle-color bg-subcard transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMeta ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        {/* Search Panel */}
        <div>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_meta_templates')}
              className="pl-11 h-11 w-full border border-input-border-color rounded-lg bg-input-color font-semibold text-xs transition-all focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
        </div>

        {/* Templates List Container */}
        <div className="flex-1 overflow-y-auto min-h-[250px] border border-input-border-color rounded-lg bg-subcard">
          {isLoadingMeta ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner />
              <p className="text-xs text-slate-400 font-bold">
                {t('fetching_meta_templates')}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full">
                <AlertCircle size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  {t('failed_to_load_meta')}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  {error instanceof Object && 'data' in error
                    ? (error as any).data?.message
                    : t('meta_fetch_error_desc')}
                </p>
              </div>
              <Button size="sm" onClick={() => refetch()} className="mt-2 h-10 sm:h-12 p-padding! bg-primary text-white!  font-bold rounded-radius text-sm">
                {t('retry')}
              </Button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <p className="text-xs font-bold">
                {searchQuery
                  ? t('no_matching_meta_templates')
                  : t('no_meta_templates_available')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-900">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 bg-bg-card sticky top-0 z-10 border-b border-input-border-color gap-2 sm:gap-0">
                <div className="flex items-center gap-4 flex-1">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleToggleAll}
                    className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm font-black text-subtitle-color">
                    {t('template_name_header')}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-black text-subtitle-color shrink-0 w-44 text-right pr-2">
                  {t('category_status_header')}
                </span>
              </div>

              {/* Data rows */}
              {filteredTemplates.map((item) => {
                const isChecked = selectedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleOne(item.id)}
                    className={`flex flex-col sm:flex-row sm:items-center px-4 py-3.5 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 cursor-pointer transition-colors gap-3 sm:gap-0 ${isChecked ? 'bg-primary/[0.02]' : ''}`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleOne(item.id)}
                          className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                      <div className="min-w-0 pr-4">
                        <p className="text-sm font-black text-title truncate">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-subtitle-color mt-0.5">
                          ID: <span className="font-mono">{item.id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-start sm:justify-end gap-2 shrink-0 sm:w-44 pl-8 sm:pl-0">
                      {/* Category Badge */}
                      <Badge variant="outline" className="font-extrabold uppercase text-[9px] px-2 py-0.5 border-input-border-color text-slate-500 bg-bg-card">
                        {item.category}
                      </Badge>

                      {/* Status Badge */}
                      <Badge variant="outline" className={`font-black uppercase text-[9px] px-2.5 py-0.5 border tracking-wide ${getStatusBadgeStyle(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-2 pt-4 border-t border-slate-100 dark:border-zinc-900 sm:items-center justify-between shrink-0">
          <span className="text-sm font-bold text-subtitle-color text-center sm:text-left w-full sm:w-auto">
            {t('templates_selected_count', {
              count: selectedIds.length,
              defaultValue: `${selectedIds.length} templates selected`
            })}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={isSyncing}
              onClick={onClose}
              className="h-11 p-padding! border-input-border-color bg-subcard text-subtitle-color rounded-lg transition-all font-bold text-sm flex-1 sm:flex-none"
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              disabled={selectedIds.length === 0 || isSyncing}
              onClick={handleSync}
              className="h-11 p-padding! bg-primary text-white font-extrabold rounded-lg transition-all text-sm flex-1 sm:flex-none"
            >
              {isSyncing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t('sync_selected')}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
