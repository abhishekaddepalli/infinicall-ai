import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const TeamMemberDashboardSkeleton = ({ rowCount = 2 }: { rowCount?: number } = {}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-none shadow-none bg-bg-card rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-white/10" />
                  <Skeleton className="h-8 w-16 bg-slate-200 dark:bg-white/10" />
                  <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-white/10" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {/* Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-11 w-full sm:max-w-md bg-slate-200 dark:bg-white/10 rounded-radius" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-[140px] bg-slate-200 dark:bg-white/10 rounded-radius" />
            <Skeleton className="h-11 w-11 bg-slate-200 dark:bg-white/10 rounded-radius" />
            <Skeleton className="h-11 w-11 bg-slate-200 dark:bg-white/10 rounded-radius" />
          </div>
        </div>

        {/* List Skeleton */}
        <div className="rounded-lg border border-input-border-color bg-bg-card overflow-x-auto custom-scrollbar flex flex-col">
          {[...Array(rowCount)].map((_, i) => (
            <div key={i} className={`flex items-center p-5 sm:p-6 gap-4 sm:gap-6 w-max min-w-full ${i !== rowCount - 1 ? 'border-b border-input-border-color' : ''}`}>
              {/* Icon & Details */}
              <div className="flex items-center gap-4 min-w-[250px]">
                <Skeleton className="w-[42px] h-[42px] rounded-xl shrink-0 bg-slate-200 dark:bg-white/10" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32 bg-slate-200 dark:bg-white/10" />
                    <Skeleton className="h-5 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
                  </div>
                  <Skeleton className="h-3 w-40 bg-slate-200 dark:bg-white/10" />
                  <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-white/10" />
                </div>
              </div>

              {/* Columns */}
              <div className="flex-1 grid grid-cols-4 gap-4 shrink-0 px-6 items-center w-full min-w-[500px] sm:min-w-[600px] xl1580:min-w-[680px]">
                {[
                  { w1: 'w-16', w2: 'w-10', h2: 'h-5' },
                  { w1: 'w-24', w2: 'w-32', h2: 'h-4' },
                  { w1: 'w-20', w2: 'w-32', h2: 'h-4' },
                  { w1: 'w-24', w2: 'w-6', h2: 'h-5' }
                ].map((col, colIdx) => (
                  <div key={colIdx} className="space-y-2">
                    <Skeleton className={`h-3 ${col.w1} bg-slate-200 dark:bg-white/10`} />
                    <Skeleton className={`${col.h2} ${col.w2} bg-slate-200 dark:bg-white/10`} />
                  </div>
                ))}
              </div>

              {/* Updated & Actions */}
              <div className="flex items-center gap-6 shrink-0 ml-auto">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-white/10" />
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-[172px] rounded-full bg-slate-200 dark:bg-white/10" />
                  <Skeleton className="h-9 w-9 rounded-radius bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
