'use client'

import { DataTable } from "@/components/reusable/DataTable"
import { NativeAudioWithOverlay } from "@/components/reusable/NativeAudioWithOverlay"
import { PageHeader } from "@/components/reusable/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ROUTES } from "@/constants/routes"
import { useGetCampaignHistoryQuery } from "@/redux/api/campaignApi"
import { Column } from "@/types/table"
import { formatDate } from "@/utils/validation-schemas"
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Globe2,
  MessageSquareCode,
  Phone,
  PhoneCall,
  TrendingUp,
  User
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function CampaignHistoryPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const { data: response, isLoading } = useGetCampaignHistoryQuery(campaignId, {
    skip: !campaignId,
  })

  const [activeTranscript, setActiveTranscript] = useState<string | null>(null)
  const [activeLeadName, setActiveLeadName] = useState<string>("")

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        <p className="text-sm font-bold text-zinc-400 animate-pulse uppercase tracking-wider">
          {t("loading_campaign_history")}
        </p>
      </div>
    )
  }

  const history = response?.data
  if (!history) {
    return (
      <div className="py-12 text-center max-w-md mx-auto space-y-4">
        <p className="text-slate-500">{t("campaign_history_not_found")}</p>
        <Button onClick={() => router.push(ROUTES.CAMPAIGNS)} className="rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
      </div>
    )
  }

  const { campaign, agent, metrics, calls } = history

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0s"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${seconds}s`
  }

  const getCallStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-edit/10 text-edit border-edit/50 rounded-full px-2.5 font-bold uppercase tracking-wider text-[9px]">{t("completed")}</Badge>
      case 'failed':
        return <Badge className="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200/50 rounded-full px-2.5 font-bold uppercase tracking-wider text-[9px]">{t("failed")}</Badge>
      default:
        return <Badge className="bg-blue-500/10 text-blue-600 rounded-full px-2.5 font-bold uppercase tracking-wider text-[9px]">{status}</Badge>
    }
  }

  const columns: Column<any>[] = [
    {
      header: t("recipient"),
      className: 'lg991:min-w-[250px]',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight">
              {row.lead_name || t("unknown_lead")}
            </span>
            <span className="text-xs text-zinc-400 tracking-wider font-semibold">{row.to_number}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("status"),
      className: 'lg991:min-w-[180px]',
      cell: (row) => getCallStatusBadge(row.status),
    },
    {
      header: t("duration"),
      className: 'lg991:min-w-[120px]',
      cell: (row) => (
        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          {formatDuration(row.duration)}
        </span>
      ),
    },
    {
      header: t("started_at"),
      className: 'lg991:min-w-[200px]',
      cell: (row) => (
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          {row.started_at ? formatDate(row.started_at) : '-'}
        </span>
      ),
    },
    {
      header: t("recording"),
      className: 'lg991:min-w-[280px]',
      cell: (row) => (
        <div className="min-w-[200px]">
          {row.recording_url ? (
            <NativeAudioWithOverlay
              src={row.recording_url}
              durationInSeconds={row.duration}
              className="w-[240px]!"
            />
          ) : (
            <span className="text-md text-subtitle-color break-all whitespace-normal line-clamp-2">{t('no_recording') || 'No recording'}</span>
          )}
        </div>
      ),
    },
    {
      header: t("actions"),
      className: 'lg991:min-w-[180px]',
      cell: (row) => (
        <div className="flex gap-2">
          {row.transcript ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTranscript(row.transcript)
                setActiveLeadName(row.lead_name || row.to_number)
              }}
              className="h-8 rounded-lg flex items-center gap-1.5 text-xs font-bold bg-primary/5 hover:bg-primary border-primary/20 text-primary hover:text-white dark:text-title"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              {t("transcript")}
            </Button>
          ) : (
            <span className="text-xs text-zinc-400 italic font-medium">—</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <PageHeader
          title={`${campaign?.name} — ${t("history_analytics")}`}
        />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden rounded-radius border border-input-border-color! bg-bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50! cursor-pointer">
          {/* Top-right corner linear gradient */}
          <div className="absolute top-0 right-0 rtl:right-[unset]! rtl:left-0! w-1/2 h-full bg-gradient-to-bl rtl:bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <CardContent className="relative z-10 p-4 sm:p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-title transition-colors">
                {t("total_leads")}
              </p>
              <h3 className="text-2xl font-extrabold text-title tracking-tight">
                {metrics?.totalLeads || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-radius border border-input-border-color! bg-bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/30! cursor-pointer">
          {/* Top-right corner linear gradient */}
          <div className="absolute top-0 right-0 rtl:right-[unset]! rtl:left-0! w-1/2 h-full bg-gradient-to-bl rtl:bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <CardContent className="relative z-10 sm:p-6 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-title transition-colors">
                {t("completed_calls")}
              </p>
              <h3 className="text-2xl font-extrabold text-title tracking-tight">
                {metrics?.completedCount || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-radius border border-input-border-color! bg-bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/50! cursor-pointer">
          {/* Top-right corner linear gradient */}
          <div className="absolute top-0 right-0 rtl:right-[unset]! rtl:left-0! w-1/2 h-full bg-gradient-to-bl rtl:bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          <CardContent className="relative z-10 sm:p-6 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-title transition-colors">
                {t("avg_duration")}
              </p>
              <h3 className="text-2xl font-extrabold text-title tracking-tight">
                {formatDuration(metrics?.avgDuration)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-radius border border-input-border-color! bg-bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/50! cursor-pointer">
          {/* Top-right corner linear gradient */}
          <div className="absolute top-0 right-0 rtl:right-[unset]! rtl:left-0! w-1/2 h-full bg-gradient-to-bl rtl:bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <CardContent className="relative z-10 sm:p-6 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-title transition-colors">
                {t("success_rate")}
              </p>
              <h3 className="text-2xl font-extrabold text-title tracking-tight">
                {metrics?.successRate || 0}%
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent & Setup Detail Panel */}
      {agent && (
        <Card className="rounded-2xl border border-input-border-color! bg-bg-card overflow-hidden relative group">
          {/* Subtle background pattern/gradient */}
          <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-primary/10 to-transparent pointer-events-none opacity-50" />

          <CardContent className="p-4 sm:p-6 space-y-5 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/10 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-title flex items-center gap-2">
                    {t("assigned_voice_agent")}
                  </h4>
                  <p className="text-md font-medium text-subtitle-color mt-0.5">
                    {t("agent_configurations_desc")}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 px-3 py-1 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t("active_agent")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-subcard rounded-radius p-4 border border-input-border-color! transition-all duration-300 group/item">
                <span className="text-md font-bold capitalize tracking-wider mb-2 block text-title  transition-colors">
                  {t("agent_name")}
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-md font-bold text-subtitle-color truncate">{agent.name}</span>
                </div>
              </div>

              <div className="bg-subcard rounded-radius p-4 border border-input-border-color! transition-all duration-300 group/item">
                <span className="text-md font-bold capitalize tracking-wider mb-2 block text-title  transition-colors">
                  {t("language")}
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <Badge variant="secondary" className="p-0 text-subtitle-color uppercase text-md tracking-wide font-bold">
                    {agent.language || t('english')}
                  </Badge>
                </div>
              </div>

              <div className="bg-subcard rounded-radius p-4 border border-input-border-color! transition-all duration-300 group/item">
                <span className="text-md font-bold capitalize tracking-wider mb-2 block text-title  transition-colors">
                  {t("telephony_provider")}
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-md font-bold text-subtitle-color capitalize truncate">
                    {agent.telephony_provider?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="bg-subcard rounded-radius p-4 border border-input-border-color! transition-all duration-300 group/item">
                <span className="text-md font-bold capitalize tracking-wider mb-2 block text-title  transition-colors">
                  {t("llm_model")}
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-md font-bold text-subtitle-color truncate">
                    {typeof agent.llm_model === 'object' && agent.llm_model
                      ? agent.llm_model?.display_name || agent.llm_model?.name || t("unknown")
                      : typeof agent.llm_model === 'string' && agent.llm_model
                        ? agent.llm_model
                        : typeof agent.llm_model === 'string' && agent.llm_model
                          ? agent.llm_model
                          : "GPT-4o Mini"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calls Leads List */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-title">
          {t("call_history_leads")}
        </h4>

        <DataTable
          columns={columns}
          data={calls || []}
          totalResults={calls?.length || 0}
          totalPages={1}
          onPageChange={() => { }}
          searchPlaceholder={t("filter_by_lead_name")}
          emptyStateTitle={t("no_call_history_title", "No Call History Found")}
          emptyMessage={t("no_call_history_desc", "Call records will appear here once the campaign starts executing.")}
        />
      </div>

      {/* Transcript Viewer Dialog */}
      <Dialog open={!!activeTranscript} onOpenChange={(open) => { if (!open) setActiveTranscript(null) }}>
        <DialogContent className="max-w-[600px] max-h-[80vh] gap-0! overflow-y-auto no-scrollbar bg-bg-card border-none shadow-2xl rounded-lg sm:p-6 p-4">
          <DialogHeader className="mb-0">
            <DialogTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-3">
              {t("conversation_transcript_with")} {activeLeadName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="max-h-[50vh] overflow-y-auto no-scrollbar">
              {activeTranscript && (
                Array.isArray(activeTranscript) && activeTranscript.length > 0 ? (
                  <div className="space-y-4">
                    {activeTranscript.map((tItem: any, idx: number) => (
                      <div key={idx} className={`flex flex-col ${tItem.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-1.5 mb-1 px-1 ${tItem.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-sm font-extrabold uppercase ${tItem.role === 'user' ? 'text-primary' : 'text-slate-400 dark:text-zinc-500'}`}>
                            {tItem.role === 'user' ? t('user') : t('agent')}
                          </span>
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[85%] text-[15px] font-semibold shadow-sm leading-relaxed ${tItem.role === 'user' ? 'bg-primary text-white rounded-tr-none border border-primary/15' : 'bg-primary/10 text-primary rounded-tl-none border border-input-border-color'}`}>
                          <div className="whitespace-pre-wrap break-words dark:text-title">{tItem.text}</div>
                          {tItem.timestamp && (
                            <div className="flex justify-end mt-1.5">
                              <span className={`text-xs font-medium ${tItem.role === 'user' ? 'text-white' : 'text-subtitle-color'}`}>
                                {new Date(tItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : typeof activeTranscript === 'string' && activeTranscript.trim().length > 0 ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {activeTranscript}
                  </p>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-zinc-400 italic">{t("no_transcript_available")}</span>
                  </div>
                )
              )}

              {!activeTranscript && (
                <div className="flex items-center justify-center py-8">
                  <span className="text-sm text-zinc-400 italic">{t("no_transcript_available")}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setActiveTranscript(null)} className="rounded-xl px-6 text-white">
                {t("close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
