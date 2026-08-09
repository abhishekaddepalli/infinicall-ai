'use client'

import { DataTable } from "@/components/reusable/DataTable"
import { PageHeader } from "@/components/reusable/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"
import { useGetSmsCampaignHistoryQuery } from "@/redux/api/smsCampaignApi"
import { Column } from "@/types/table"
import { formatDate } from "@/utils/validation-schemas"
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  TrendingUp,
  User
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function SmsCampaignHistoryPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: response, isLoading, isFetching } = useGetSmsCampaignHistoryQuery(
    { id: campaignId, page, limit },
    { skip: !campaignId }
  )

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
        <Button onClick={() => router.push(ROUTES.SMS_CAMPAIGNS)} className="rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
      </div>
    )
  }

  const { campaign, metrics, calls } = history

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent':
      case 'completed':
        return <Badge className="bg-edit/10 text-edit dark:bg-edit/10 dark:text-edit border-edit/20 rounded-full px-2.5 font-bold uppercase tracking-wider text-[9px]">{status}</Badge>
      case 'failed':
        return <Badge className="bg-destructive/10 text-destructive dark:bg-destructive-900/20! dark:border-destructive-900/30 rounded-full px-2.5 font-bold uppercase tracking-wider text-[9px]">{t("failed")}</Badge>
      default:
        return <Badge className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-white/10 rounded-full px-2.5 font-bold uppercase tracking-wider text-[9px]">{status}</Badge>
    }
  }

  const columns: Column<any>[] = [
    {
      header: t("recipient"),
      className: "md767:min-w-[250px]",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-title text-md tracking-tight mb-1 break-all whitespace-normal line-clamp-1">
              {row.lead_name || t("unknown_lead")}
            </span>
            <span className="text-sm text-subtitle-color font-semibold">{row.to_number}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("status"),
      className: "md767:min-w-[200px]",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: t("sent_at"),
      className: "md767:min-w-[250px]",
      cell: (row) => (
        <span className="text-md font-bold text-subtitle-color">
          {row.started_at ? formatDate(row.started_at) : '-'}
        </span>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <Card className="rounded-lg border border-input-border-color bg-bg-card overflow-hidden transition-all">
          <CardContent className="sm:p-6 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <p className="text-md font-bold text-subtitle-color break-all whitespace-normal line-clamp-1">
                {t("total_leads")}
              </p>
              <h3 className="text-2xl font-black text-title mt-1">
                {metrics?.totalLeads || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-input-border-color bg-bg-card overflow-hidden transition-all">
          <CardContent className="sm:p-6 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-md font-bold text-subtitle-color break-all whitespace-normal line-clamp-1">
                {t("completed_calls")}
              </p>
              <h3 className="text-2xl font-black text-title mt-1">
                {metrics?.completedCount || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-input-border-color bg-bg-card overflow-hidden transition-all">
          <CardContent className="sm:p-6 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-md font-bold text-subtitle-color break-all whitespace-normal line-clamp-1">
                {t("success_rate")}
              </p>
              <h3 className="text-2xl font-black text-title mt-1">
                {metrics?.successRate || 0}%
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Info Panel */}
      {campaign && (
        <Card className="rounded-lg border border-input-border-color bg-bg-card overflow-hidden transition-all">
          <CardContent className="sm:p-6 p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-input-border-color pb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h4 className="text-base font-bold text-title">
                {t("campaign_message")}
              </h4>
            </div>
            <div className="text-md text-subtitle-color">
              {campaign?.content || history.logs?.[0]?.message_body || "No message content."}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SMS Logs */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-title">
          {t("sms_logs")}
        </h4>

        <DataTable
          columns={columns}
          data={history.logs || []}
          isLoading={isLoading || isFetching}
          totalResults={history.pagination?.total || (history.logs || []).length}
          currentPage={history.pagination?.page || page}
          totalPages={history.pagination?.pages || Math.ceil((history.logs || []).length / limit)}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
          searchPlaceholder={t("filter_by_lead_name")}
          emptyStateTitle={t("no_sms_logs_title", "No SMS Logs Found")}
          emptyMessage={t("no_sms_logs_desc", "Message records will appear here once the campaign starts executing.")}
        />
      </div>
    </div>
  )
}
