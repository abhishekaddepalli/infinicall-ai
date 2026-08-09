import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataViewToolbarProps } from '@/types/shared'
import { LayoutGrid, List, Search, Trash2 } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'

export function DataViewToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  viewMode,
  onViewModeChange,
  filterNode,
  selectedCount = 0,
  onBulkDelete,
  isBulkDeleting,
  onSelectAll,
  isAllSelected,
  hasItems
}: DataViewToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="z-30 bg-bg-body pb-6 mb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Left: Search */}
        <div className="relative w-full sm:w-100">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color" />
          <Input
            placeholder={searchPlaceholder || t('search')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-lg bg-input-color! border-input-border-color "
          />
        </div>

        {/* Right: Filters & View Toggle */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          {filterNode && (
            <div className="flex items-center gap-2.5">
              {filterNode}
            </div>
          )}

          {filterNode && (
            <div className="hidden sm:block w-px h-6 bg-input-border-color mx-1" />
          )}

          {/* Select All */}
          {onSelectAll && hasItems && (
            <div className="flex items-center gap-2 mr-2">
              <Input
                type="checkbox"
                id="selectAll"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800"
              />
              <Label htmlFor="selectAll" className="text-md font-medium text-muted-foreground cursor-pointer select-none">
                {t('select_all', { defaultValue: 'Select All' })}
              </Label>
              <div className="hidden sm:block w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />
            </div>
          )}

          {/* Bulk Actions */}
          {onBulkDelete && selectedCount > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkDelete}
                disabled={isBulkDeleting || selectedCount === 0}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-900/20 h-10 px-4 font-bold"
              >
                {isBulkDeleting ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-1" />
                )}
                {t('bulk_delete', { defaultValue: 'Bulk Delete' })}{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </Button>
              <div className="hidden sm:block w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />
            </div>
          )}

          {/* View Toggle (Grid / List) */}
          <div className="flex items-center h-10  bg-input-color! rounded-lg p-1 border border-input-border-color">
            <Button
              onClick={() => onViewModeChange('grid')}
              className={`p-2! rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground! bg-transparent'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onViewModeChange('list')}
              className={`p-2! rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground! bg-transparent'}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
