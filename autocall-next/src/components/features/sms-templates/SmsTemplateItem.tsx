import { DataViewCard } from '@/components/reusable/data-view/DataViewCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { SmsTemplateItemProps } from '@/types/sms-campaign'
import { MessageSquareQuote, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SmsTemplateItem({
  template,
  viewMode,
  isLastItem,
  canUpdate,
  canDelete,
  onStatusToggle,
  onEdit,
  onDelete
}: SmsTemplateItemProps) {
  const { t } = useTranslation()
  const id = template.id || template._id

  const toggleSwitch = (
    <Switch
      checked={template.status === 'active'}
      onCheckedChange={() => onStatusToggle(template)}
      disabled={template.is_system || false}
      title={
        template.status === 'active'
          ? t('deactivate')
          : t('activate')
      }
    />
  )

  const toggleSwitchDisabled = (
    <Switch checked={template.status === 'active'} disabled />
  )

  const icon = (
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <MessageSquareQuote className="w-5 h-5 text-primary" />
    </div>
  )

  const listContent = (
    <div className="flex-1 flex flex-row items-center px-6 min-w-0">
      {/* Content in the middle to recover space */}
      <div className="flex-1 min-w-0 pr-6">
        <p className="text-md font-medium text-subtitle-color break-all w-full overflow-hidden text-ellipsis line-clamp-2 whitespace-normal">
          {template.content || '-'}
        </p>
      </div>
    </div>
  )

  const actions = (
    <>
      {viewMode === 'list' && (
        <div className="flex items-center justify-center mr-1 h-[38px]">
          {canUpdate ? toggleSwitch : toggleSwitchDisabled}
        </div>
      )}

      {(canUpdate || canDelete) ? (
        <>
          {canUpdate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(template)}
              disabled={template.is_system || false}
              className="h-9 w-9 rounded-radius bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title={t("edit")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              disabled={template.is_system || false}
              className="h-9 w-9 rounded-radius bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title={t("delete")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </>
      ) : (
        <span className="text-[10px] text-muted-foreground/30 font-extrabold uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg shrink-0">
          {t('view_only')}
        </span>
      )}
    </>
  )

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={template.name}
      description={viewMode === 'grid' ? (template.content || '-') : undefined}
      listContent={listContent}
      headerRight={viewMode === 'grid' ? (canUpdate ? toggleSwitch : toggleSwitchDisabled) : undefined}
      updatedAt={template.updated_at}
      actions={actions}
      gridHeightClass="min-h-[220px]"
    />
  )
}
