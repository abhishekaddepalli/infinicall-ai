'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { NativeAudioWithOverlay } from '@/components/reusable/NativeAudioWithOverlay'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scrollArea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useGetCallLogsQuery } from '@/redux/api/callApi'
import { useScanCallTranscriptMutation } from '@/redux/api/restrictedWordsApi'
import { CallLog } from '@/types/flow'
import { Column } from '@/types/table'
import { format } from 'date-fns'
import { AlertTriangle, Clock, Eye, Phone, PhoneIncoming, PhoneOutgoing, ScanSearch } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import TakeActionModal from './TakeActionModal'

export default function CallLogsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [directionFilter, setDirectionFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUser, setSelectedUser] = useState<CallLog | null>(null)
  const [isScannedSort, setIsScannedSort] = useState(false)
  const [limit, setLimit] = useState(10)

  const [scanCall, { isLoading: isScanning }] = useScanCallTranscriptMutation()

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  const { data: callLogsResponse, isLoading, isFetching, refetch } = useGetCallLogsQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter === 'all' ? undefined : statusFilter,
    direction: directionFilter === 'all' ? undefined : directionFilter,
    sortColumn,
    sortOrder,
    prioritizeRestricted: isScannedSort
  })

  const handleScanAll = async () => {
    try {
      await scanCall('all').unwrap()
      toast.success(t('scan_call_success') || 'Calls scanned successfully')
      setIsScannedSort(true)
      setPage(1)
      refetch()
    } catch (error) {
      toast.error(t('scan_call_failed') || 'Failed to scan calls')
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const getStatusBadge = (status: string) => {
    const normalizedStatus = (status || '').toLowerCase().replace(/\s+/g, '-');
    switch (normalizedStatus) {
      case 'completed': return <Badge variant="outline" className="bg-edit/10 text-edit border-edit/20 hover:bg-edit/20 font-semibold px-2.5 py-0.5">{t('completed') || 'Completed'}</Badge>
      case 'failed': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-semibold px-2.5 py-0.5">{t('failed') || 'Failed'}</Badge>
      case 'busy': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-semibold px-2.5 py-0.5">{t('busy') || 'Busy'}</Badge>
      case 'no-answer': return <Badge variant="outline" className="bg-cyan-500/10 text-cyan-700 border-cyan-500/20 hover:bg-cyan-500/20 dark:text-cyan-400 font-semibold px-2.5 py-0.5">{t('no_answer') || 'No Answer'}</Badge>
      case 'missed': return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20 dark:text-orange-500 font-semibold px-2.5 py-0.5">{t('missed') || 'Missed'}</Badge>
      case 'canceled': return <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20 font-semibold px-2.5 py-0.5">{t('canceled') || 'Canceled'}</Badge>
      case 'in-progress': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 font-semibold px-2.5 py-0.5">{t('in_progress') || 'In Progress'}</Badge>
      case 'queued': return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-500 font-semibold px-2.5 py-0.5">{t('queued') || 'Queued'}</Badge>
      case 'ringing': return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-500 font-semibold px-2.5 py-0.5">{t('ringing') || 'Ringing'}</Badge>
      default: return <Badge variant="outline" className="capitalize font-semibold px-2.5 py-0.5 bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-white/10">{status}</Badge>
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  const columns: Column<CallLog>[] = [
    {
      header: t('lead_name') || 'Lead Name',
      className: 'xl1920:min-w-[250px]',
      sortable: true,
      sortKey: 'lead_name',
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-title text-base break-all whitespace-normal line-clamp-1">
            {row.lead_name || '-'}
          </span>
          <span className="text-subtitle-color font-medium text-md break-all whitespace-normal line-clamp-1">{row.to_number}</span>
        </div>
      ),
    },
    {
      header: t('direction') || 'Direction',
      className: 'xl1920:min-w-[180px]',
      sortable: true,
      sortKey: 'direction',
      cell: (row) => (
        <div className={cn("flex items-center gap-1.5 w-max px-2.5 py-1 rounded-radius text-sm font-semibold",
          row.direction === 'inbound' || row.direction === 'incoming'
            ? "bg-incoming dark:bg-incoming/10 text-incoming-color"
            : "bg-outgoing dark:bg-outgoing/10 text-outgoing-color"
        )}>
          {row.direction === 'inbound' || row.direction === 'incoming' ? (
            <PhoneIncoming className="w-3.5 h-3.5" />
          ) : (
            <PhoneOutgoing className="w-3.5 h-3.5" />
          )}
          <span className="capitalize">
            {row.direction === 'inbound' || row.direction === 'incoming' ? t('incoming') || 'Incoming' : t('outgoing') || 'Outgoing'}
          </span>
        </div>
      ),
    },
    {
      header: t('agent_campaign') || 'Agent/Campaign',
      className: 'xl1920:min-w-[250px]',
      cell: (row) => {
        if (row.agent_id && typeof row.agent_id === 'object' && row.agent_id.name) {
          return <span className="text-md text-title font-semibold break-all whitespace-normal line-clamp-2">{row.agent_id.name}</span>
        }
        if (row.campaign_id && typeof row.campaign_id === 'object' && row.campaign_id.name) {
          return <span className="text-md text-title font-semibold break-all whitespace-normal line-clamp-2">{row.campaign_id.name}</span>
        }
        return <span className="text-md text-subtitle-color font-medium italic">-</span>
      },
    },
    {
      header: t('date') || 'Date',
      className: 'xl1920:min-w-[180px]',
      sortable: true,
      sortKey: 'created_at',
      cell: (row) => <span className="text-md text-title font-semibold">{format(new Date(row.created_at), 'MMM dd, yyyy HH:mm')}</span>,
    },
    {
      header: t('status'),
      className: 'xl1920:min-w-[150px]',
      sortable: true,
      sortKey: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: t('interaction_time') || 'Interaction Time',
      className: 'xl1920:min-w-[150px]',
      sortable: true,
      sortKey: 'duration',
      cell: (row) => (
        <div className="flex items-center gap-2 text-title font-semibold text-md">
          <Clock className="w-4 h-4 text-primary" />
          <span>{formatDuration(row.duration)}</span>
        </div>
      ),
    },
    {
      header: t('recording') || 'Recording',
      className: 'xl1920:min-w-[280px]',
      cell: (row) => (
        <div className="min-w-[200px]">
          {row.recording_url ? (
            <NativeAudioWithOverlay src={row.recording_url} durationInSeconds={row.duration} className="w-[240px]!" />
          ) : (
            <span className="text-md text-subtitle-color break-all whitespace-normal line-clamp-2">{t('no_recording') || 'No recording'}</span>
          )}
        </div>
      ),
    },
    {
      header: t('action') || 'Action',
      className: 'xl1920:min-w-[100px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.detected_words && row.detected_words.length > 0 && (
            <Button variant="ghost" size="icon" onClick={() => setSelectedUser(row)} className="h-9 w-9 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-colors" title={t('take_action') || 'Take Action'}>
              <AlertTriangle className="h-4 w-4" />
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary bg-primary/10  hover:text-white transition-colors">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]! gap-0! max-w-[calc(100%-2rem)]! sm:p-6 p-4 border-none bg-bg-card max-h-[90vh] overflow-auto no-scrollbar rounded-modal-radius">
              <DialogHeader className='text-left rtl:text-right'>
                <DialogTitle>{t('call_transcript') || 'Call Transcript'}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] mt-4 pr-4">
                {row.transcript && row.transcript.length > 0 ? (
                  <div className="flex flex-col gap-6 pt-2 pb-4">
                    {row.transcript.map((msg, idx) => {
                      const isUser = msg.role === 'user';
                      const time = msg.timestamp ? format(new Date(msg.timestamp), 'hh:mm a') : '';
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex flex-col w-full",
                            isUser ? "items-end" : "items-start"
                          )}
                        >
                          <span className={cn(
                            "text-sm font-bold text-slate-500 mb-1",
                            isUser ? "text-right rtl:text-left" : "text-left rtl:text-right"
                          )}>
                            {msg.role ? msg.role.charAt(0).toUpperCase() + msg.role.slice(1) : 'Unknown'}
                          </span>
                          <div
                            className={cn(
                              "flex max-w-[85%] flex-col gap-1 px-4 py-3 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
                              isUser
                                ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                                : "bg-primary/10 text-primary rounded-2xl rounded-tl-sm"
                            )}
                          >
                            <span className="leading-relaxed whitespace-pre-wrap">{msg.text}</span>
                            {time && (
                              <span className={cn(
                                "text-xs mt-1 text-right",
                                isUser ? "text-white" : "text-subtitle-color"
                              )}>
                                {time}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-subtitle-color">
                    {t('no_transcript_available') || 'No transcript available.'}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ]

  const filteredData = useMemo(() => {
    return callLogsResponse?.data || [];
  }, [callLogsResponse?.data]);

  return (
    <div className="w-full h-full flex flex-col space-y-4">

      <TableLayout
        title={t('call_activity') || 'Call Activity'}
        headerIcon={<Phone className="w-8 h-8 text-primary" />}
        columns={columns}
        data={filteredData}
        isLoading={isLoading || isFetching}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_call_activity') || 'Search call activity...'}
        emptyStateTitle={t("no_call_activity_found") || 'No Call Activity Found'}
        emptyMessage={t("no_call_activity_desc") || 'You do not have any call activity yet.'}
        totalResults={callLogsResponse?.pagination?.total || filteredData.length}
        currentPage={callLogsResponse?.pagination?.page || page}
        totalPages={callLogsResponse?.pagination?.totalPages || 1}
        onPageChange={setPage}
        rowsPerPage={callLogsResponse?.pagination?.limit || limit}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        showBackButton={false}
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleScanAll} disabled={isScanning} className="gap-2 h-11 p-padding! text-sm font-semibold rounded-lg bg-primary text-white">
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanSearch className="w-5 h-5" />}
              {t('sync_now') || 'Sync Now'}
            </Button>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] bg-bg-card border-input-border-color h-11 text-title rounded-radius">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: 'all', label: t('all_status') || 'All Status' },
                  { value: 'completed', label: t('completed') || 'Completed' },
                  { value: 'queued', label: t('queued') || 'Queued' },
                  { value: 'in-progress', label: t('in_progress') || 'In Progress' },
                  { value: 'failed', label: t('failed') || 'Failed' },
                  { value: 'busy', label: t('busy') || 'Busy' },
                  { value: 'no-answer', label: t('no_answer') || 'No Answer' },
                  { value: 'canceled', label: t('canceled') || 'Canceled' }
                ].map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={directionFilter} onValueChange={(val) => { setDirectionFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] bg-bg-card border-input-border-color h-11 text-title rounded-radius">
                <SelectValue placeholder={t('direction')} />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: 'all', label: t('all_direction') || 'All Direction' },
                  { value: 'inbound', label: t('incoming') || 'Incoming' },
                  { value: 'outbound', label: t('outgoing') || 'Outgoing' }
                ].map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
      {selectedUser && (
        <TakeActionModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}
    </div>
  )
}
