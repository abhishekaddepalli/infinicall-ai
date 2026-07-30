import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DataViewPaginationProps } from '@/types/shared'
import { useTranslation } from 'react-i18next'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { RowsPerPageSelector } from '../RowsPerPageSelector'

export function DataViewPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onRowsPerPageChange
}: DataViewPaginationProps) {
  const { t } = useTranslation()
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalItems <= 0) return null

  const startResult = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endResult = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-4 mt-6 mb-4">
      <div className="flex items-center gap-3">
        {onRowsPerPageChange && (
          <RowsPerPageSelector rowsPerPage={itemsPerPage} onRowsPerPageChange={onRowsPerPageChange} />
        )}
        <div className="text-sm text-subtitle-color font-semibold">
          {totalItems > 0 ? (
            <>
              {t('showing')}{' '}
              <span className="text-title font-bold">{startResult}</span>{' '}
              {t('to')}{' '}
              <span className="text-title font-bold">{endResult}</span>{' '}
              {t('of')}{' '}
              <span className="text-title font-bold">{totalItems}</span>{' '}
              {t('results')}
            </>
          ) : (
            <>
              {t('page')}{' '}
              <span className="font-bold text-foreground dark:text-white">{currentPage}</span>{' '}
              {t('of')}{' '}
              <span className="font-bold text-foreground dark:text-white">{totalPages === 0 ? 1 : totalPages}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-radius cursor-pointer bg-pagination dark:bg-primary/40 hover:bg-primary hover:text-white! transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10 text-subtitle-color">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              )
            }

            const isCurrent = page === currentPage

            return (
              <Button
                key={page}
                variant={isCurrent ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'text-xs font-bold cursor-pointer rounded-radius transition-all dark:border-white/10',
                  isCurrent
                    ? 'bg-primary text-white pointer-events-none'
                    : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-primary! hover:text-white!'
                )}
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-radius cursor-pointer bg-pagination dark:bg-primary/40 hover:bg-primary! hover:text-white! transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
