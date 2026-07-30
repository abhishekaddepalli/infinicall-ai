import { DataViewCard } from '@/components/reusable/data-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CampaignItemProps } from '@/types/campaign'
import { AlertCircle, Bot, CheckCircle, Edit2, HelpCircle, History, Megaphone, Pause, PauseCircle, Phone, Play, Trash2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CampaignItem({
  campaign,
  viewMode,
  isLastItem,
  onStatusChange,
  onHistory,
  onEdit,
  onDelete,
}: CampaignItemProps) {
  const { t } = useTranslation()
  const id = campaign._id || campaign.id || ""

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <Play className="w-3 h-3 fill-current" />
            {t("active")}
          </Badge>
        )
      case 'Completed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/20 flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <CheckCircle className="w-3 h-3" />
            {t("completed")}
          </Badge>
        )
      case 'Failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200/50 flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <AlertCircle className="w-3 h-3" />
            {t("failed")}
          </Badge>
        )
      case 'Paused':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <PauseCircle className="w-3 h-3" />
            {t("paused")}
          </Badge>
        )
      case 'Cancelled':
        return (
          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-white/10 flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <XCircle className="w-3 h-3" />
            {t("cancelled")}
          </Badge>
        )
      default: // Draft
        return (
          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-white/10 flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <HelpCircle className="w-3 h-3" />
            {t("draft")}
          </Badge>
        )
    }
  }

  const typeName = typeof campaign.typeId === 'object' && campaign.typeId?.name ? campaign.typeId.name : ""
  const agentName = typeof campaign.agentId === 'object' && campaign.agentId?.name ? campaign.agentId.name : ""
  const phoneNumber = typeof campaign.phoneNumberId === 'object' && campaign.phoneNumberId?.phone_number ? campaign.phoneNumberId.phone_number : ""

  const icon = (
    <div className={`rounded-lg flex items-center justify-center shrink-0 bg-campaign dark:bg-campaign/10 ${viewMode === 'list' ? 'sm:w-[42px] sm:h-[42px] w-[40px] h-[40px]' : 'w-[48px] h-[48px]'}`}>
      <Megaphone className={` ${viewMode === 'list' ? ' w-5 h-5 text-campaign-color' : 'w-5 h-5 text-campaign-color'}`} />
    </div>
  )

  const tags = (
    <>
      {campaign.typeId && (
        <code className="px-2 py-0.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-lg text-[11px] font-medium text-muted-foreground">
          {typeName}
        </code>
      )}
      {viewMode === 'grid' && (
        <>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-subcard px-2 py-1 rounded-md">
            {agentName ? (
              <>
                <Bot className="w-4 h-4" />
                <span className="truncate max-w-[100px] text-sm">{agentName}</span>
              </>
            ) : (
              <span className="truncate max-w-[100px] text-sm px-1">-</span>
            )}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-subcard px-2 py-1 rounded-md">
            {phoneNumber ? (
              <>
                <Phone className="w-3 h-3" />
                <span className="tracking-wider text-sm">{phoneNumber}</span>
              </>
            ) : (
              <span className="tracking-wider text-sm px-1">-</span>
            )}
          </span>
        </>
      )}
    </>
  )

  const listContent = (
    <div className="flex items-center flex-1 justify-center gap-12 xl:gap-24 shrink-0 px-4">
      <div className="flex flex-col w-[200px]">
        <span className="text-md font-medium text-muted-foreground mb-1.5">{t('agent')}</span>
        <div className="flex items-center gap-2">
          {agentName ? (
            <>
              <Bot className="w-4 h-4 text-edit shrink-0" />
              <span className="text-md font-medium text-subtitle-color truncate">{agentName}</span>
            </>
          ) : (
            <span className="text-md font-medium text-subtitle-color truncate">-</span>
          )}
        </div>
      </div>

      <div className="w-px h-[48px] bg-zinc-200/60 dark:bg-zinc-700/60 shrink-0" />

      <div className="flex flex-col w-[200px]">
        <span className="text-md font-medium text-muted-foreground mb-1.5">{t('phone_number')}</span>
        <div className="flex items-center gap-2">
          {phoneNumber ? (
            <>
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-md font-medium text-subtitle-color tracking-wider truncate">{phoneNumber}</span>
            </>
          ) : (
            <span className="text-md font-medium text-subtitle-color tracking-wider truncate">-</span>
          )}
        </div>
      </div>
    </div>
  )

  const actions = (
    <>
      {(campaign.campaignStatus === 'Draft' || campaign.campaignStatus === 'Paused') && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange?.(campaign, 'Active')}
          title={campaign.campaignStatus === 'Paused' ? t("resume_campaign", "Resume Campaign") : t("start_campaign")}
          className="h-9 w-9 rounded-radius bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
        >
          <Play className="h-4 w-4 ml-0.5" />
        </Button>
      )}
      {campaign.campaignStatus === 'Active' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange?.(campaign, 'Paused')}
          title={t("pause_campaign", "Pause Campaign")}
          className="h-9 w-9 rounded-radius bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
        >
          <Pause className="h-4 w-4" />
        </Button>
      )}
      {(campaign.campaignStatus === 'Active' || campaign.campaignStatus === 'Paused') && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange?.(campaign, 'Cancelled')}
          title={t("cancel_campaign", "Cancel Campaign")}
          className="h-9 w-9 rounded-radius bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white transition-all"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      )}
      {campaign.campaignStatus !== 'Draft' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onHistory(id)}
          title={t("campaign_history")}
          className="h-9 w-9 rounded-radius bg-slate-500/10 text-slate-500 dark:text-slate-400 hover:bg-slate-500 hover:text-white transition-all"
        >
          <History className="h-4 w-4" />
        </Button>
      )}
      {campaign.campaignStatus === 'Draft' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(id)}
          title={t("edit")}
          className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        title={t("delete")}
        className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={campaign.name}
      statusBadge={getStatusBadge(campaign.campaignStatus)}
      tags={tags}
      description={campaign.description}
      listContent={listContent}
      updatedAt={campaign.updated_at || campaign.created_at}
      actions={actions}
      gridHeightClass="min-h-[280px]"
    />
  )
}
