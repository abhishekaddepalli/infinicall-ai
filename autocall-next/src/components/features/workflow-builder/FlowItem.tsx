import { DataViewCard } from '@/components/reusable/data-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { FlowItemProps } from '@/types/flow'
import { GitCommit, GitMerge, Network, Pencil, Play, Trash2, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/redux/hooks'

export function FlowItem({
  flow,
  viewMode,
  isLastItem,
  onStatusChange,
  onEdit,
  onDelete,
  onTest,
  selectable,
  isSelected,
  onSelectChange,
}: FlowItemProps) {
  const { t } = useTranslation()
  const flowId = flow._id || flow.id || ""

  const user = useAppSelector((state: any) => state.auth?.user)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const icon = (
    <div
      className={`rounded-lg flex items-center justify-center shrink-0 bg-build dark:bg-build/10 ${viewMode === 'list' ? 'sm:w-[42px] sm:h-[42px] w-[40px] h-[40px]' : 'w-[48px] h-[48px]'
        }`}
    >
      <Network className={` ${viewMode === 'list' ? ' w-5  h-5 text-build-color' : 'w-5 h-5 text-build-color'}`} />
    </div>
  )

  const statusBadge = (
    <Badge
      className={`text-[10px] font-medium px-2 py-0.5 border-0 rounded-full tracking-wider ${flow.status === 'active'
        ? 'bg-edit/10 text-edit'
        : 'bg-subcard text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}
    >
      {flow.status === 'active' ? t('active') : t('inactive')}
    </Badge>
  )

  const toggleSwitch = (
    <Switch
      checked={flow.status === 'active'}
      onCheckedChange={() => onStatusChange(flow)}
      title={
        flow.status === 'active'
          ? t('deactivate')
          : t('activate')
      }
    />
  )

  const nodesCount = flow.nodes?.length || 0
  const edgesCount = flow.edges?.length || 0

  const listMetaContent = (
    <div className="flex flex-col mt-0.5 min-w-0">
      {flow.description && (
        <div className="text-md text-subtitle-color leading-relaxed pr-4 line-clamp-2 mb-2 mt-1">
          {flow.description}
        </div>
      )}
    </div>
  )

  const gridMetaContent = (
    <>
      <div className="flex items-center flex-nowrap gap-2 mb-4">
        <Badge className="bg-input-color text-zinc-600 dark:text-zinc-400 border border-input-border-color px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wider flex items-center gap-1">
          <GitCommit className="w-3 h-3" />
          {nodesCount} {t('nodes')}
        </Badge>
        <Badge className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wider flex items-center gap-1">
          <GitMerge className="w-3 h-3" />
          {edgesCount} {t('connections')}
        </Badge>
      </div>

      <div className="min-h-[42px] mb-4">
        {flow.description ? (
          <p className="text-sm text-subtitle-color leading-relaxed line-clamp-2 pr-2">
            {flow.description}
          </p>
        ) : (
          <p className="text-sm text-subtitle-color leading-relaxed opacity-60">
            {t('no_description_provided')}
          </p>
        )}
      </div>
    </>
  )

  const listContent = (
    <div className="flex items-center flex-1 justify-around gap-4 shrink-0 px-4">
      <div className="flex flex-col flex-1 max-w-[250px] items-center text-center">
        <span className="text-md font-medium text-muted-foreground mb-1.5">{t('nodes')}</span>
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-edit shrink-0" />
          <span className="text-base font-bold text-title">{nodesCount}</span>
        </div>
      </div>

      <div className="w-px h-[48px] bg-zinc-200/60 dark:bg-zinc-700/60 shrink-0" />

      <div className="flex flex-col flex-1 max-w-[250px] items-center text-center">
        <span className="text-md font-medium text-muted-foreground mb-1.5">{t('connections')}</span>
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-base font-bold text-title">{edgesCount}</span>
        </div>
      </div>
    </div>
  )

  const actions = (
    <>
      {viewMode === 'list' && (
        <div className="flex items-center justify-center mr-1 h-[38px]">
          {toggleSwitch}
        </div>
      )}
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTest && onTest(flow)}
          title={t('test_flow', { defaultValue: 'Test Flow' })}
          className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all mr-1"
        >
          <Play className="h-4 w-4" />
        </Button>
        {flow.system_flow && !isAdmin ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(flow)}
            title={t('view')}
            className="h-9 w-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(flow)}
              title={t('edit')}
              className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(flowId)}
              title={t('delete')}
              className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </>
    </>
  )

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={flow.name}
      statusBadge={statusBadge}
      headerRight={viewMode === 'grid' ? toggleSwitch : undefined}
      listMetaContent={listMetaContent}
      gridMetaContent={gridMetaContent}
      listContent={listContent}
      updatedAt={flow.updated_at || flow.created_at}
      actions={actions}
      selectable={selectable}
      isSelected={isSelected}
      onSelectChange={onSelectChange}
      gridHeightClass="min-h-[220px]"
    />
  )
}
