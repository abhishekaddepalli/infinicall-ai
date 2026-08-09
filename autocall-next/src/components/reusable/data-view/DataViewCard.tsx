import { Input } from '@/components/ui/input'
import { DataViewCardProps } from '@/types/shared'
import { formatDistanceToNow } from '@/utils/validation-schemas'
import { useTranslation } from 'react-i18next'

export function DataViewCard({
  viewMode,
  isLastItem,
  icon,
  title,
  statusBadge,
  headerRight,
  tags,
  description,
  listMetaContent,
  gridMetaContent,
  gridContent,
  listContent,
  updatedAt,
  actions,
  selectable,
  isSelected,
  onSelectChange,
  gridHeightClass = 'min-h-[350px]',
  listTitleWidthClass,
}: DataViewCardProps) {
  const { t } = useTranslation()
  if (viewMode === 'list') {
    return (
      <div
        className={`group w-full sm:p-6 p-4 flex items-center transition-all duration-200 border-l-2 rtl:border-l-0  rtl:border-r-2 border-l-transparent hover:border-l-primary hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${!isLastItem ? 'border-b border-input-border-color' : ''
          }`}
      >
        {/* Left: Icon + Name + Type */}
        <div className={`flex items-center gap-4 flex-1 pr-4 ${listTitleWidthClass || 'min-w-[200px] max-w-[496px] xl1580:min-w-[360px]'}`}>
          {selectable && (
            <div className="flex items-center shrink-0 pt-2.5">
              <Input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectChange?.(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          )}
          <div className="shrink-0">{icon}</div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="text-base font-medium text-title truncate">{title}</span>
              {statusBadge}
            </div>

            {listMetaContent ? (
              listMetaContent
            ) : (
              <>
                {tags && (
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    {tags}
                  </div>
                )}

                {description && (
                  <div className="text-md text-subtitle-color leading-relaxed pr-4 line-clamp-2">
                    {description}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center */}
        {listContent && (
          <>
            <div className="w-px h-12 bg-input-border-color shrink-0" />
            {listContent}
          </>
        )}

        <div className={`w-px h-12 bg-input-border-color shrink-0 ${!listContent ? 'ml-auto rtl:ml-0 rtl:mr-auto' : ''}`} />

        {/* Right: Actions & Updated */}
        <div className="flex items-center justify-start gap-8 shrink-0 min-w-[320px] lg:min-w-[400px] pl-4 rtl:pl-0 rtl:pr-4">
          <div className="flex flex-col items-start min-w-[140px] lg:min-w-[160px] shrink-0">
            <span className="text-md font-medium text-title break-all whitespace-normal line-clamp-1">{t('updated')}</span>
            <div className="flex items-center gap-1.5 text-md text-subtitle-color mt-0.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className='text-md text-nowrap text-subtitle-color '>
                {updatedAt ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true }) : 'Unknown'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 pl-2 xl1580:min-w-[155px]">
            {actions}
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className={`bg-bg-card border border-input-border-color rounded-radius flex flex-col sm:p-6 p-4 ${gridHeightClass}`}>
      {/* Header: Icon, Name, Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {selectable && (
            <div className="flex items-center shrink-0">
              <Input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectChange?.(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          )}
          <div className="shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-medium text-title truncate">{title}</span>
            </div>
            {statusBadge}
          </div>
        </div>
        {headerRight && (
          <div className="flex items-center gap-1.5 shrink-0 ml-4">
            {headerRight}
          </div>
        )}
      </div>

      {gridMetaContent ? (
        gridMetaContent
      ) : (
        <>
          {/* Tags */}
          {tags && (
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {tags}
            </div>
          )}

          {/* Description */}
          <div className="min-h-[42px] mb-4">
            {description ? (
              <p className="text-md text-subtitle-color break-all whitespace-normal line-clamp-3 leading-relaxed pr-2">
                {description}
              </p>
            ) : (
              <p className="text-sm text-subtitle-color leading-relaxed">
                {t('no_description_provided')}
              </p>
            )}
          </div>
        </>
      )}

      {/* Custom Grid Stats / Content */}
      {gridContent && (
        <div className="mb-4 mt-auto">
          {gridContent}
        </div>
      )}

      {/* Footer: Date & Actions */}
      <div className="flex items-center flex-wrap gap-3 justify-between mt-auto pt-4 border-t border-input-border-color">
        <div className="flex items-center gap-1.5 text-sm font-medium text-subtitle-color">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>
            {updatedAt ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true }) : 'Unknown'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {actions}
        </div>
      </div>
    </div>
  )
}
