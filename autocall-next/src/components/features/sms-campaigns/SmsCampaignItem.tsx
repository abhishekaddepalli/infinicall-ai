import { DataViewCard } from '@/components/reusable/data-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SmsCampaignItemProps } from '@/types/sms-campaign'
import { AlertCircle, CheckCircle, HelpCircle, History, Pencil, Play, Pause, XCircle, Send, Trash2, PauseCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SmsCampaignItem({
  campaign,
  viewMode,
  isLastItem,
  canUpdate = true,
  canDelete = true,
  canView = true,
  onStatusChange,
  onHistory,
  onEdit,
  onDelete,
}: SmsCampaignItemProps) {
  const { t } = useTranslation()
  const campaignId = campaign.id || campaign._id || ""

  const icon = (
    <div
      className={`rounded-lg flex items-center justify-center shrink-0 bg-outgoing dark:bg-outgoing/10 ${viewMode === 'list' ? 'sm:w-10.5 sm:h-10.5 w-10 h-10' : 'w-12 h-12'
        }`}
    >
      <Send className={` ${viewMode === 'list' ? 'sm:w-6 w-5 sm:h-6 h-5 text-outgoing-color' : 'w-5 h-5 text-outgoing-color'}`} />
    </div>
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] hover:bg-blue-500/20">
            <Play className="w-3 h-3 fill-current" />
            {t("active")}
          </Badge>
        )
      case 'Completed':
        return (
          <Badge variant="outline" className="bg-edit/10 text-edit flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] border-edit/15">
            <CheckCircle className="w-3 h-3" />
            {t("completed")}
          </Badge>
        )
      case 'Failed':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] hover:bg-destructive/20">
            <AlertCircle className="w-3 h-3" />
            {t("failed")}
          </Badge>
        )
      case 'Paused':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] hover:bg-amber-500/20">
            <PauseCircle className="w-3 h-3" />
            {t("paused")}
          </Badge>
        )
      case 'Cancelled':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] hover:bg-rose-500/20">
            <XCircle className="w-3 h-3" />
            {t("cancelled")}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] hover:bg-slate-500/20">
            <HelpCircle className="w-3 h-3" />
            {t("draft")}
          </Badge>
        )
    }
  }

  const typeName = typeof campaign.typeId === 'object' ? campaign.typeId?.name : null
  const phoneNumber = typeof campaign.phoneNumberId === 'object' ? campaign.phoneNumberId?.phone_number : null

  const listMetaContent = null

  const gridMetaContent = typeName ? (
    <>
      <div className="flex items-center flex-nowrap gap-2 mb-4">
        <Badge variant="secondary" className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-md text-[10px] font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">
          {typeName}
        </Badge>
      </div>
    </>
  ) : (
    <div className="flex items-center flex-nowrap gap-2 mb-4">
      <span className="text-sm font-medium text-subtitle-color">-</span>
    </div>
  )

  const listContent = (
    <div className="flex-1 grid grid-cols-2 gap-6 shrink-0 px-8 items-center w-full">
      <div className="flex flex-col">
        <span className="text-md font-bold text-subtitle-color mb-2 break-all whitespace-normal line-clamp-1">{t("type")}</span>
        <div className="flex items-center">
          {typeName ? (
            <Badge variant="secondary" className="bg-subcard text-subtitle-color text-sm font-bold flex items-center gap-1.5 px-2.5 py-1 w-fit">
              {typeName}
            </Badge>
          ) : (
            <span className="text-subtitle-color font-bold">-</span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-md font-bold text-subtitle-color mb-2 break-all whitespace-normal line-clamp-1">{t("phone_number")}</span>
        <div className="flex items-center">
          {phoneNumber ? (
            <span className="flex items-center gap-2 text-sm font-bold text-title tracking-wider w-fit">
              {phoneNumber}
            </span>
          ) : (
            <span className="text-subtitle-color font-bold">-</span>
          )}
        </div>
      </div>
    </div>
  );

  const gridContent = (
    <div className="flex flex-col min-w-[120px] mb-2">
      <span className="text-xs font-medium text-muted-foreground mb-1">{t('phone_number')}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">{phoneNumber || "-"}</span>
      </div>
    </div>
  )

  const actions = (
    <>
      {canUpdate && (campaign.status === 'Draft' || campaign.status === 'Paused') && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange?.(campaign, 'Active')}
          title={campaign.status === 'Paused' ? t("resume_campaign", "Resume Campaign") : t("start_campaign")}
          className="h-9 w-9 rounded-radius bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
        >
          <Play className="h-4 w-4 ml-0.5" />
        </Button>
      )}
      {canUpdate && campaign.status === 'Active' && (
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
      {canUpdate && (campaign.status === 'Active' || campaign.status === 'Paused') && (
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
      {canView && campaign.status !== 'Draft' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onHistory(campaignId)}
          title={t("campaign_history")}
          className="h-9 w-9 rounded-radius bg-slate-500/10 text-slate-500 dark:text-slate-400 hover:bg-slate-500 hover:text-white! transition-all"
        >
          <History className="h-4 w-4" />
        </Button>
      )}
      {canUpdate && campaign.status === 'Draft' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(campaignId)}
          title={t('edit')}
          className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(campaignId)}
          title={t('delete')}
          className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </>
  )

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={campaign.name}
      statusBadge={getStatusBadge(campaign.status)}
      listMetaContent={listMetaContent}
      gridMetaContent={gridMetaContent}
      listContent={listContent}
      gridContent={gridContent}
      updatedAt={campaign.updated_at || campaign.created_at}
      actions={actions}
      gridHeightClass="min-h-[210px]"
    />
  )
}
