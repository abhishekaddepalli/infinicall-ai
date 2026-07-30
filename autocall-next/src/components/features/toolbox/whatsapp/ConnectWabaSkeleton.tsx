import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ConnectWabaSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-slate-100 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-72 bg-slate-100 dark:bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-xl bg-slate-100 dark:bg-zinc-800 self-start sm:self-center" />
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Left Integration Card Skeleton */}
          <Card className="rounded-radius border border-input-border-color bg-bg-card shadow-sm overflow-hidden">
            <CardContent className="sm:p-6 p-4 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                  <Skeleton className="h-6 w-24 rounded-full bg-slate-100 dark:bg-zinc-800" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-slate-100 dark:bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-slate-100 dark:bg-zinc-800" />
                </div>
              </div>
              <Skeleton className="h-11 w-full rounded-lg bg-slate-100 dark:bg-zinc-800" />
            </CardContent>
          </Card>

          {/* Right Webhook Card Skeleton */}
          <Card className="rounded-radius border border-input-border-color bg-bg-card shadow-sm overflow-hidden">
            <CardContent className="sm:p-6 p-4 space-y-6">
              <Skeleton className="h-6 w-40 bg-slate-100 dark:bg-zinc-800" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-100 dark:bg-zinc-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                    <Skeleton className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 bg-slate-100 dark:bg-zinc-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                    <Skeleton className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
