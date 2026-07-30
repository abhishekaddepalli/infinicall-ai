'use client'

import { DataViewCard } from '@/components/reusable/data-view'
import { DataViewToolbar } from '@/components/reusable/data-view/DataViewToolbar'
import { NativeAudioWithOverlay } from '@/components/reusable/NativeAudioWithOverlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Eye, FileText, Filter, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export function TeamMemberRecentCalls({
  stats,
  cardVariants,
  t,
  onSearchChange
}: {
  stats: any
  cardVariants: any
  t: any
  onSearchChange?: (search: string) => void
}) {
  const recentTransferredCalls = stats?.tables?.recentTransferredCalls || []

  const [selectedTranscript, setSelectedTranscript] = useState<any>(null)
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, onSearchChange])

  const handleViewTranscript = (transcript: any) => {
    setSelectedTranscript(transcript)
    setIsTranscriptModalOpen(true)
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  const filteredCalls = useMemo(() => {
    return recentTransferredCalls.filter((call: any) => {
      const callStatus = (call.transfer_details?.human_call_status || call.status || 'unknown').toLowerCase()

      if (typeFilter !== 'all' && callStatus !== typeFilter) {
        return false
      }

      // We still keep the local search logic so that it filters the returned results immediately,
      // while the backend search fetches matching items across the whole database.
      if (search) {
        const searchLower = search.toLowerCase()
        const numberStr = (call.customer_number || call.customer_id?.phone_number || call.to_number || call.from_number || '').toLowerCase()
        const agentStr = (call.agent_id?.name || '').toLowerCase()
        if (!numberStr.includes(searchLower) && !agentStr.includes(searchLower)) {
          return false
        }
      }
      return true
    })
  }, [recentTransferredCalls, search, typeFilter])

  const filterNode = (
    <Select value={typeFilter} onValueChange={setTypeFilter}>
      <SelectTrigger className="w-[140px] h-10 bg-input-color! border-input-border-color">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <SelectValue placeholder={t('all_types')} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all_types')}</SelectItem>
        <SelectItem value="completed">{t('completed')}</SelectItem>
        <SelectItem value="initiated">{t('initiated')}</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <motion.div variants={cardVariants} className="space-y-4">
      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterNode={filterNode}
        searchPlaceholder={t('search_calls')}
      />

      <div className={viewMode === 'list' ? "rounded-lg border border-input-border-color bg-bg-card overflow-x-auto no-scrollbar" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {filteredCalls.length === 0 ? (
          <div className={viewMode === 'list' ? "p-8 text-center text-muted-foreground min-w-[800px]" : "col-span-full p-8 text-center text-muted-foreground bg-bg-card rounded-xl border border-input-border-color"}>
            {t('no_transferred_calls_found')}
          </div>
        ) : (
          <div className={viewMode === 'list' ? "w-max min-w-full flex flex-col" : "contents"}>
            {filteredCalls.map((call: any, index: number) => {
              const callStatus = call.transfer_details?.human_call_status || call.status || 'unknown'
              const isSuccess = ['answered', 'completed'].includes(callStatus.toLowerCase())
              const recordingUrl = call.transfer_details?.human_recording_url || call.recording_url
              const direction = call.direction || 'outbound'
              const isLastItem = index === filteredCalls.length - 1

              const icon = (
                <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                  {direction === 'inbound' ? <PhoneIncoming className="w-5 h-5" /> : <PhoneOutgoing className="w-5 h-5" />}
                </div>
              )

              const statusBadge = (
                <Badge variant="outline" className={`px-2.5 py-0.5 flex items-center rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${isSuccess ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50'
                  : 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/50'
                  }`}>
                  {callStatus}
                </Badge>
              )

              const listMetaContent = (
                <div className="flex flex-col mt-1 space-y-1 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('agent')}:</span>
                    <span className="text-xs font-bold text-subtitle-color break-all whitespace-normal line-clamp-1">{call.agent_id?.name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('campaign')}:</span>
                    <span className="text-xs font-bold text-subtitle-color break-all whitespace-normal line-clamp-1">{call.campaign_id?.name || '-'}</span>
                  </div>
                </div>
              )

              const contentLayout = (
                <>
                  <div className="flex flex-col">
                    <span className="text-md font-medium text-subtitle-color mb-1">{t('duration')}</span>
                    <span className="text-lg font-bold text-title">{formatDuration(call.transfer_details?.human_duration || 0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-md font-medium text-subtitle-color mb-1">{t('transferred_at')}</span>
                    <span className="text-md font-bold text-title">
                      {call.transfer_details?.transferred_at ? format(new Date(call.transfer_details.transferred_at), 'MMM dd, yyyy HH:mm') : '-'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-md font-medium text-subtitle-color mb-1">{t('ended_at')}</span>
                    <span className="text-md font-bold text-title">
                      {call.transfer_details?.ended_at ? format(new Date(call.transfer_details.ended_at), 'MMM dd, yyyy HH:mm') : '-'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-md font-medium text-subtitle-color mb-1">{t('credits_used')}</span>
                    <span className="text-lg font-bold text-title">
                      {call.credits_used != null ? `${call.credits_used}` : '0'}
                    </span>
                  </div>
                </>
              )

              const listContent = (
                <div className="flex-1 grid grid-cols-4 gap-4 shrink-0 px-6 items-center w-full min-w-[500px] sm:min-w-[600px] xl1580:min-w-[680px]">
                  {contentLayout}
                </div>
              )

              const gridContent = (
                <div className="grid grid-cols-2 gap-4">
                  {contentLayout}
                </div>
              )

              const actions = (
                <>
                  {recordingUrl ? (
                    <NativeAudioWithOverlay src={recordingUrl} durationInSeconds={call.transfer_details?.human_duration || 0} className="w-[172px]!" />
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 w-32 xl:w-40 text-center">-</span>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => handleViewTranscript(call.transfer_details?.human_transcript)}
                    className="flex items-center justify-center h-9! w-9! p-0! rounded-radius bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    title={t('view_transcript')}
                  >
                    <Eye className="w-5 h-5" strokeWidth={2} />
                  </Button>
                </>
              )

              return (
                <DataViewCard
                  key={index}
                  viewMode={viewMode}
                  isLastItem={isLastItem}
                  icon={icon}
                  title={call.customer_number || call.customer_id?.phone_number || call.to_number || t('unknown')}
                  statusBadge={statusBadge}
                  listMetaContent={listMetaContent}
                  gridMetaContent={listMetaContent}
                  listContent={listContent}
                  gridContent={gridContent}
                  updatedAt={call.created_at}
                  actions={actions}
                />
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={isTranscriptModalOpen} onOpenChange={setIsTranscriptModalOpen}>
        <DialogContent className="sm:max-w-2xl max-w-[calc(100%-2rem)] max-h-[80vh] overflow-auto no-scrollbar flex flex-col sm:p-6 p-4 gap-0! border-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t('call_transcript')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-input-border-color">
            {selectedTranscript ? (
              Array.isArray(selectedTranscript) ? (
                <div className="space-y-4">
                  {selectedTranscript.map((msg: any, i: number) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'agent' || msg.role === 'human' ? 'items-start' : 'items-end'}`}>
                      <span className="text-md capitalize font-bold text-subtitle-color mb-1">{msg.role}</span>
                      <div className={`p-3 rounded-lg max-w-[80%] text-md relative sm:pb-6 pb-4 ${msg.role === 'agent' || msg.role === 'human' ? 'bg-bg-card! border border-input-border-color' : 'bg-primary text-white'}`}>
                        {msg.text || msg.content}
                        {msg.timestamp && (
                          <span className={`absolute bottom-1 right-2 text-[10px] font-medium opacity-70s ${msg.role === 'agent' || msg.role === 'human' ? 'text-slate-400' : 'text-white/80'}`}>
                            {format(new Date(msg.timestamp), 'h:mm a')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-md whitespace-pre-wrap font-sans">{JSON.stringify(selectedTranscript, null, 2)}</pre>
              )
            ) : (
              <p className="text-md text-muted-foreground text-center">{t('no_transcript_available_call')}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
