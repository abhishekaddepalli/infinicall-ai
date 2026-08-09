import { DataViewLayoutProps } from '@/types/shared'

export function DataViewLayout<T>({
  items,
  isLoading,
  emptyState,
  viewMode,
  renderListItem,
  renderGridItem,
  loadingSkeleton
}: DataViewLayoutProps<T>) {
  if (isLoading) {
    return (
      <div className={viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'}>
        {loadingSkeleton || (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return <>{emptyState}</>
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-bg-card border border-input-border-color rounded-lg overflow-auto table-custom-scrollbar">
        <div className="flex flex-col min-w-max">
          {items.map((item, index) => renderListItem(item, index))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {items.map((item, index) => renderGridItem(item, index))}
    </div>
  )
}
