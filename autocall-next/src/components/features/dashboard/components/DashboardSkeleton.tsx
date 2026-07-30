'use client'
// SKELETON CARD SUBCOMPONENTS FOR CLEAN REUSABLE SHIMMERS

function WelcomeCardShimmer() {
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-primary/20 h-full min-h-54 w-full flex flex-col justify-between p-6 shadow-lg"
      style={{
        backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, #001a2e 0%, #012d46 50%, #013d5e 100%)
  `,
        backgroundSize: '35px 35px, 35px 35px, auto'
      }}
    >
      <div className="space-y-4">
        <div className="h-4 w-28 bg-white/10 rounded-full" />
        <div className="h-7 w-48 bg-white/20 rounded-lg" />
        <div className="h-3 w-full bg-white/10 rounded-md" />
        <div className="h-3 w-5/6 bg-white/10 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="h-3.5 w-24 bg-white/10 rounded-md" />
        <div className="h-5 w-14 bg-white/20 rounded-md" />
      </div>
    </div>
  )
}

function StatCardShimmer() {
  return (
    <div className="p-6 rounded-xl bg-bg-card border border-input-border-color shadow-sm dark:shadow-none h-full min-h-[110px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-slate-200 dark:bg-white/10 rounded-md" />
        <div className="h-7 w-7 bg-slate-200 dark:bg-white/15 rounded-lg" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-6 w-24 bg-slate-300 dark:bg-white/20 rounded-md" />
        <div className="h-3 w-32 bg-slate-200 dark:bg-white/10 rounded-sm" />
      </div>
    </div>
  )
}

function ChartCardShimmer({ height = '400px', type = 'area' }: { height?: string; type?: 'area' | 'bar' | 'donut' }) {
  return (
    <div className="p-6 rounded-xl bg-bg-card border border-input-border-color shadow-sm dark:shadow-none flex flex-col justify-between" style={{ height }}>
      <div className="flex items-center justify-between border-b border-input-border-color/60 pb-4">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-200 dark:bg-white/10 rounded-sm" />
          <div className="h-5 w-36 bg-slate-300 dark:bg-white/20 rounded-md" />
        </div>
        <div className="h-5 w-16 bg-slate-200 dark:bg-white/10 rounded-lg" />
      </div>

      <div className="flex-1 flex items-end justify-center pt-8 relative">
        {type === 'donut' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-36 w-36 rounded-full border-[16px] border-slate-100 dark:border-white/10 border-t-slate-200 dark:border-t-white/20 animate-pulse" />
          </div>
        ) : (
          <div className="flex-1 flex items-end gap-3 px-4 h-[80%]">
            <div className="h-[25%] flex-1 bg-slate-200/60 dark:bg-white/5 rounded-t-md" />
            <div className="h-[55%] flex-1 bg-slate-300/60 dark:bg-white/10 rounded-t-md" />
            <div className="h-[40%] flex-1 bg-slate-200/60 dark:bg-white/5 rounded-t-md" />
            <div className="h-[85%] flex-1 bg-slate-300/60 dark:bg-white/10 rounded-t-md" />
            <div className="h-[50%] flex-1 bg-slate-200/60 dark:bg-white/5 rounded-t-md" />
            <div className="h-[65%] flex-1 bg-slate-300/60 dark:bg-white/10 rounded-t-md" />
            <div className="h-[90%] flex-1 bg-slate-200/60 dark:bg-white/5 rounded-t-md" />
          </div>
        )}
      </div>
    </div>
  )
}

function ListCardShimmer({ height = '400px', count = 3 }: { height?: string; count?: number }) {
  return (
    <div className="p-6 rounded-xl bg-bg-card border border-input-border-color shadow-sm dark:shadow-none flex flex-col justify-between" style={{ height }}>
      <div>
        <div className="flex items-center justify-between border-b border-input-border-color/60 pb-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-slate-200 dark:bg-white/10 rounded-sm" />
            <div className="h-5 w-40 bg-slate-300 dark:bg-white/20 rounded-md" />
          </div>
          <div className="h-5 w-10 bg-slate-200 dark:bg-white/10 rounded-lg" />
        </div>
        <div className="space-y-3 mt-4">
          {Array.from({ length: count }).map((_, j) => (
            <div key={j} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-input-border-color/30 dark:border-white/5 bg-subcard dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-300 dark:bg-white/20 rounded-md" />
                  <div className="h-2 w-16 bg-slate-200 dark:bg-white/10 rounded-sm" />
                </div>
              </div>
              <div className="h-4 w-12 bg-slate-200 dark:bg-white/15 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SubscriptionCardShimmer() {
  return (
    <div className="p-6 rounded-xl border border-input-border-color bg-bg-card shadow-sm dark:shadow-none flex flex-col justify-between h-full min-h-[216px]">
      <div>
        <div className="flex items-center justify-between border-b border-input-border-color/60 pb-4">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 dark:bg-white/10 rounded-sm" />
            <div className="h-5 w-28 bg-slate-300 dark:bg-white/20 rounded-md" />
          </div>
          <div className="h-5 w-16 bg-slate-200 dark:bg-white/10 rounded-sm" />
        </div>
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-5 w-48 bg-slate-300 dark:bg-white/20 rounded-md" />
          <div className="h-3 w-56 bg-slate-200 dark:bg-white/10 rounded-sm" />
        </div>
      </div>
      <div className="h-11 w-full bg-slate-300/50 dark:bg-white/10 rounded-lg mt-2" />
    </div>
  )
}

// 1. SKELETON FOR ADMIN DASHBOARD FLOW
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse p-1">
      {/* Row 1: Welcome (span 2) + 6 Counters (span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-2">
          <WelcomeCardShimmer />
        </div>
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardShimmer key={i} />
          ))}
        </div>
      </div>

      {/* Row 1.5: Additional Statistics Counters (span 5 inline) */}
      <div className="bg-bg-card border border-input-border-color rounded-radius p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-slate-200 dark:bg-white/10 rounded-sm" />
                <div className="h-5 w-16 bg-slate-300 dark:bg-white/20 rounded-md" />
                <div className="h-2 w-24 bg-slate-200 dark:bg-white/10 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Monthly Revenue Chart (span 3) + Recent Registrations (span 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ChartCardShimmer height="438px" type="area" />
        </div>
        <div className="lg:col-span-2">
          <ListCardShimmer height="438px" count={5} />
        </div>
      </div>

      {/* Row 3: System Workflows (span 1) + Recent Campaigns Table (span 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ListCardShimmer height="400px" count={3} />
        </div>
        <div className="lg:col-span-2">
          <ListCardShimmer height="400px" count={3} />
        </div>
      </div>

      {/* Row 3.5: Admin Lower Section (span 1 + span 1 + span 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ListCardShimmer height="380px" count={4} />
        </div>
        <div className="lg:col-span-1">
          <ChartCardShimmer height="380px" type="donut" />
        </div>
        <div className="lg:col-span-1">
          <ListCardShimmer height="380px" count={4} />
        </div>
      </div>

      {/* Row 4: Recent Calls Table (span 2) + Weekly Call Volume Chart (span 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2">
          <ListCardShimmer height="400px" count={4} />
        </div>
        <div className="lg:col-span-2">
          <ChartCardShimmer height="400px" type="bar" />
        </div>
      </div>
    </div>
  )
}

// 2. SKELETON FOR USER DASHBOARD FLOW
export function UserDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse p-1">
      {/* Row 1: WelcomeCard, QuickAccess, Subscription */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-[1480px]:grid-cols-3 gap-6 items-stretch">
        <div className="flex">
          <WelcomeCardShimmer />
        </div>
        <ListCardShimmer height="100%" count={4} />
        <SubscriptionCardShimmer />
      </div>

      {/* Row 2: 5 Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardShimmer key={i} />
        ))}
      </div>

      {/* Row 3: Recent Campaigns + Recent SMS Campaigns (lg:grid-cols-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ListCardShimmer height="320px" count={4} />
        <ListCardShimmer height="320px" count={4} />
      </div>

      {/* Row 4: Weekly Call History + Recent Contacts + Weekly Campaign Volume (lg:grid-cols-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCardShimmer height="320px" type="area" />
        <ListCardShimmer height="320px" count={4} />
        <ChartCardShimmer height="320px" type="bar" />
      </div>

      {/* Row 5: Recent Team Members + Recent Activity (lg:grid-cols-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ListCardShimmer height="415px" count={5} />
        <ListCardShimmer height="415px" count={5} />
      </div>
    </div>
  )
}

// Keep export of DashboardSkeleton for backward compatibility
export function DashboardSkeleton() {
  return <AdminDashboardSkeleton />
}
