import { DataViewCard } from '@/components/reusable/data-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SmsAgentItemProps } from '@/types/sms-campaign'
import { Globe, MessageSquare, Pencil, PhoneForwarded, Smartphone, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SmsAgentItem({
  agent,
  viewMode,
  isLastItem,
  canUpdate = true,
  canDelete = true,
  onEdit,
  onDelete,
  selectable,
  isSelected,
  onSelectChange,
}: SmsAgentItemProps) {
  const { t } = useTranslation()
  const agentId = (agent as any)._id || (agent as any).id || ""

  const icon = (
    <div
      className={`rounded-lg flex items-center justify-center shrink-0 bg-primary/10 ${viewMode === 'list' ? 'sm:w-[42px] sm:h-[42px] w-[40px] h-[40px]' : 'w-[48px] h-[48px]'
        }`}
    >
      <Smartphone className={` ${viewMode === 'list' ? 'sm:w-6 w-5 sm:h-6 h-5 text-primary' : 'w-5 h-5 text-primary'}`} />
    </div>
  )

  const statusBadge = agent.status === 'active' ? (
    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200/50 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50">
      {t("active")}
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200/50 flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/50">
      {t("inactive")}
    </Badge>
  )

  const modelName = typeof agent.llm_model === 'object' ? agent.llm_model?.display_name || agent.llm_model?.name : agent.llm_model
  const transferEnabled = agent.transfer_to_human?.enabled

  const listMetaContent = (
    <div className="flex flex-col mt-1 min-w-0">
      {agent.description ? (
        <div className="text-base text-subtitle-color font-medium leading-relaxed pr-4 line-clamp-2">
          {agent.description}
        </div>
      ) : (
        <div className="text-md text-subtitle-color leading-relaxed pr-4 break-all whitespace-normal line-clamp-2">
          {t('no_description')}
        </div>
      )}
    </div>
  )

  const gridMetaContent = (
    <>
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="bg-subcard text-subtitle-color py-1 text-[10px] font-bold tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          {agent.language?.toUpperCase() || "EN"}
        </Badge>
        {transferEnabled && (
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/20 hover:bg-blue-50 border border-blue-200/50 py-1 text-[10px] font-bold tracking-wider flex items-center gap-1.5">
            <PhoneForwarded className="w-3.5 h-3.5" />
            {t("transfer")}
          </Badge>
        )}
        {modelName && (
          <Badge variant="secondary" className="bg-subcard text-subtitle-color py-1 text-[10px] font-bold tracking-wider flex items-center gap-1.5 capitalize">
            <MessageSquare className="w-3.5 h-3.5" />
            {modelName}
          </Badge>
        )}
      </div>

      <div className="min-h-[42px] mb-4">
        {agent.description ? (
          <p className="text-md text-subtitle-color font-medium leading-relaxed line-clamp-2 pr-2">
            {agent.description}
          </p>
        ) : (
          <p className="text-md text-subtitle-color leading-relaxed break-all whitespace-normal line-clamp-2">
            {t('no_description')}
          </p>
        )}
      </div>
    </>
  )

  const listContent = (
    <div className="flex-1 grid grid-cols-3 gap-6 shrink-0 px-8 items-center w-full">
      <div className="flex flex-col">
        <span className="text-md font-bold text-subtitle-color mb-2">{t('language')}</span>
        <div className="flex items-center">
          <Badge variant="secondary" className="bg-subcard text-subtitle-color text-[11px] font-bold flex items-center gap-1.5 px-2.5 py-1 w-fit">
            <Globe className="w-3.5 h-3.5" />
            {agent.language?.toUpperCase() || "EN"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-md font-bold text-subtitle-color mb-2">{t('transfer_status')}</span>
        <div className="flex items-center">
          {transferEnabled ? (
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/20 hover:bg-blue-50 border border-blue-200/50 text-[11px] font-bold tracking-wider flex items-center gap-1.5 px-2.5 py-1 w-fit">
              <PhoneForwarded className="w-3.5 h-3.5" />
              {t("enabled")}
            </Badge>
          ) : (
            <span className="text-sm font-semibold text-slate-400">-</span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-md font-bold text-subtitle-color mb-2">{t('llm_model')}</span>
        <div className="flex items-center">
          {modelName ? (
            <span className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 capitalize w-fit">
              <div className="p-1 rounded bg-subcard text-subtitle-color">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              {modelName}
            </span>
          ) : (
            <span className="text-sm font-semibold text-slate-400">-</span>
          )}
        </div>
      </div>
    </div>
  )

  const actions = (
    <>
      {canUpdate && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(agentId)}
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
          onClick={() => onDelete(agentId)}
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
      title={agent.name}
      statusBadge={statusBadge}
      listMetaContent={listMetaContent}
      gridMetaContent={gridMetaContent}
      listContent={listContent}
      updatedAt={agent.updated_at || agent.created_at}
      actions={actions}
      selectable={selectable}
      isSelected={isSelected}
      onSelectChange={onSelectChange}
      gridHeightClass="min-h-[200px]"
    />
  )
}
