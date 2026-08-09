import { DataViewCard } from '@/components/reusable/data-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SipTrunkItemProps } from '@/types/sip-trunk'
import { Cable, Globe, Pencil, Server, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SipTrunkItem({
  trunk,
  viewMode,
  isLastItem,
  canUpdate = true,
  canDelete = true,
  onEdit,
  onDelete,
}: SipTrunkItemProps) {
  const { t } = useTranslation()
  const trunkId = trunk._id || trunk.id || ""

  const icon = (
    <div
      className={`rounded-lg flex items-center justify-center shrink-0 bg-primary/10 ${viewMode === 'list' ? 'sm:w-[42px] sm:h-[42px] w-[40px] h-[40px]' : 'w-[48px] h-[48px]'
        }`}
    >
      <Cable className={`text-primary ${viewMode === 'list' ? 'sm:w-6 w-5 sm:h-6 h-5' : 'w-5 h-5'}`} />
    </div>
  )

  const statusBadge = (
    <Badge
      className={
        trunk.status === 'active'
          ? 'bg-edit/10 text-edit border-edit/20'
          : 'bg-destructive/10 text-destructive border-destructive/20'
      }
    >
      {t(trunk.status)}
    </Badge>
  )

  const listMetaContent = (
    <div className="flex flex-col mt-0.5 min-w-0">
      <div className="flex items-center flex-wrap gap-3 mb-1.5">
        <Badge variant="outline" className="font-semibold capitalize text-[10px] border-input-border-color bg-subcard tracking-wider px-2 py-0.5">
          {trunk.provider}
        </Badge>
        <span className="text-xs font-medium text-title px-2 py-0.5 bg-subcard rounded-md">
          {trunk.engine}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-medium text-title mb-2">
        <span className="flex items-center gap-1.5">
          <Globe className="w-4 h-4" />
          <span className="break-all whitespace-normal line-clamp-1 text-md">{trunk.sip_host}</span>
        </span>
      </div>
    </div>
  )

  const gridMetaContent = (
    <>
      <div className="flex items-center flex-nowrap gap-2 mb-4">
        <Badge variant="outline" className="font-semibold capitalize text-[10px] tracking-wider px-2 py-0.5 border-input-border-color bg-subcard">
          {trunk.provider}
        </Badge>
        <span className="text-xs font-medium text-title px-2 py-0.5 bg-subcard rounded-md">
          {trunk.engine}
        </span>
      </div>
      <div className="min-h-[42px] mb-4">
        <p className="text-md text-subtitle-color leading-relaxed line-clamp-2 pr-2 break-all whitespace-normal">
          {trunk.sip_host}
        </p>
      </div>
    </>
  )

  const listContent = (
    <div className="flex-1 px-8 items-center w-full">
      <div className="flex flex-col">
        <span className="text-md font-medium text-title mb-1.5">{t('connection_details', 'Connection Details')}</span>
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-zinc-400" />
          <span className="text-md font-medium text-subtitle-color break-all whitespace-normal line-clamp-2">
            {trunk.sip_host}:{trunk.port}
          </span>
          <span className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider">
            ({trunk.transport})
          </span>
        </div>
      </div>
    </div>
  )

  const gridContent = (
    <div className="flex flex-col gap-3 mb-2">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground mb-1">{t('connection_details', 'Connection Details')}</span>
        <div className="flex items-center gap-2 bg-subcard border border-input-border-color rounded-lg p-2.5">
          <Server className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-md font-medium text-title truncate">
            {trunk.sip_host}:{trunk.port}
          </span>
          <span className="text-sm font-bold text-title uppercase tracking-wider ml-auto">
            {trunk.transport}
          </span>
        </div>
      </div>
    </div>
  )

  const actions = (
    <>
      {canUpdate && (
        <Button
          onClick={() => onEdit(trunk)}
          title={t('edit')}
          className={`flex items-center justify-center rounded-lg bg-edit/10 hover:bg-edit hover:text-white text-edit transition-all p-0! ${viewMode === 'list' ? 'h-9 w-9' : 'h-8 w-8'}`}
        >
          <Pencil className={`${viewMode === 'list' ? 'w-[15px] h-[15px]' : 'w-3.5 h-3.5'}`} />
        </Button>
      )}
      {canDelete && (
        <Button
          onClick={() => onDelete(trunkId)}
          title={t('delete')}
          className={`flex items-center justify-center rounded-lg bg-destructive/10 hover:bg-destructive hover:text-white text-destructive transition-all p-0! ${viewMode === 'list' ? 'h-9 w-9' : 'h-8 w-8'}`}
        >
          <Trash2 className={`${viewMode === 'list' ? 'w-[15px] h-[15px]' : 'w-3.5 h-3.5'}`} />
        </Button>
      )}
    </>
  )

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={trunk.name}
      statusBadge={statusBadge}
      listMetaContent={listMetaContent}
      gridMetaContent={gridMetaContent}
      listContent={listContent}
      gridContent={gridContent}
      updatedAt={trunk.updated_at || trunk.created_at}
      actions={actions}
      gridHeightClass="min-h-[240px]"
    />
  )
}
