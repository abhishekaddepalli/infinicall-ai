'use client'

import { cn } from '@/lib/utils'
import { DataCardGridProps } from '@/types/testimonial'
import { Search, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/input'
import { Pagination } from './Pagination'
import Spinner from './Spinner'
import { Button } from '../ui/button'

export function DataCardGrid<T>({
  data,
  renderCard,
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onPageChange,
  isLoading = false,
  emptyMessage,
  emptyStateTitle,
  emptyStateActionLabel,
  onEmptyStateAction,
  onRowsPerPageChange,
  rowsPerPage,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  gridClassName,
}: DataCardGridProps<T>) {
  const { t } = useTranslation()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const defaultEmptyMessage = emptyMessage || t('no_results')
  const showToolbar = !!(onSearchChange || onRowsPerPageChange)

  return (
    <div className="space-y-6">
      {showToolbar && (
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex flex-row gap-3 flex-1">
            {onSearchChange && (
              <div className={cn("relative transition-all duration-300 ease-in-out w-full max-w-md", isSearchFocused ? "w-full sm:max-w-md" : "")}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color pointer-events-none" />
                <Input placeholder={searchPlaceholder || t("search")} value={searchValue || ""} onChange={(e) => onSearchChange(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="pl-9 h-11 w-full bg-input-color  rounded-lg transition-all" />
              </div>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-100">
          <Spinner size="lg" />
        </div>
      ) : data.length > 0 ? (
        <div className={cn("grid md560:grid-cols-1! lg870:grid-cols-2! xl1480:grid-cols-3 lg:grid-cols-4 gap-6", gridClassName)}>
          {data.map((item, index) => (
            <div key={(item as any)._id || (item as any).id || index}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-radius border border-input-border-color dark:border-white/10 bg-white dark:bg-white/5 sm:p-12 p-4 text-center">
          <div className="w-16 h-16 rounded-radius bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-title mb-2">{emptyStateTitle || t("no_results_found")}</h3>
          <p className="text-gray-500 text-md dark:text-gray-400 max-w-sm mb-6">{defaultEmptyMessage}</p>
          {emptyStateActionLabel && onEmptyStateAction && (
            <Button onClick={onEmptyStateAction} className="bg-primary hover:bg-primary/90 text-white font-bold h-10 p-padding! rounded-lg flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" strokeWidth={3} />
              {emptyStateActionLabel}
            </Button>
          )}
        </div>
      )}

      {onPageChange && totalPages > 0 && (
        <div className="pt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} showRowsPerPage={true} totalResults={totalResults || (totalPages <= 1 ? data.length : 0)} />
        </div>
      )}
    </div>
  );
}
