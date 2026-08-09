import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaginationProps } from '@/types/pagination'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RowsPerPageSelector } from './RowsPerPageSelector'

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  rowsPerPage,
  onRowsPerPageChange,
  showRowsPerPage = true,
  totalResults = 0,
}: PaginationProps) {
  const { t } = useTranslation()

  const startResult = totalResults > 0 ? (currentPage - 1) * (rowsPerPage || 0) + 1 : 0
  const endResult = Math.min(currentPage * (rowsPerPage || 0), totalResults)
  // Helper to generate the page numbers to show
  const getPageNumbers = () => {
    const delta = 1
    const range = []
    const rangeWithDots = []
    let l

    range.push(1)
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i)
      }
    }
    if (totalPages > 1) {
      range.push(totalPages)
    }


    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    }
    return rangeWithDots
  }

  const pages = getPageNumbers()

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-4', className)}>
      <div className="flex items-center gap-3">
        {showRowsPerPage && onRowsPerPageChange && rowsPerPage !== undefined && (
          <RowsPerPageSelector rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} />
        )}
        <div className="text-sm text-subtitle-color font-semibold">
          {totalResults > 0 ? (
            <>
              {t('showing')}{' '}
              <span className="text-title font-bold">
                {startResult}
              </span>{' '}
              {t('to')}{' '}
              <span className="text-title font-bold">
                {endResult}
              </span>{' '}
              {t('of')}{' '}
              <span className="text-title font-bold">
                {totalResults}
              </span>{' '}
              {t('results')}
            </>
          ) : (
            <>
              {t('page')}{' '}
              <span className="font-bold text-foreground dark:text-white">
                {currentPage}
              </span>{' '}
              {t('of')}{' '}
              <span className="font-bold text-foreground dark:text-white">
                {totalPages === 0 ? 1 : totalPages}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-radius cursor-pointer bg-pagination dark:bg-primary/40 hover:bg-primary hover:text-white!  transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t('previous')}</span>
        </Button>

        <div className="flex items-center gap-2">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <div
                  key={`dots-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-subtitle-color"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  ' text-xs font-bold cursor-pointer rounded-radius transition-all dark:border-white/10',
                  currentPage === page
                    ? 'bg-primary text-white pointer-events-none'
                    : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-primary/10 hover:text-primary',
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-radius cursor-pointer dark:bg-primary/40 hover:text-white! hover:bg-primary! bg-pagination transition-all "
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t('next')}</span>
        </Button>
      </div>
    </div>
  )
}
