'use client'

import { UserChartsAndTablesProps } from '@/types/dashboard'
import { Megaphone, TrendingUp } from 'lucide-react'
import { DashboardChartCard } from './DashboardChartCard'
import { RecentActivityCard } from './RecentActivityCard'
import { RecentCampaignsCard } from './RecentCampaignsCard'
import { RecentContactsCard } from './RecentContactsCard'
import { RecentSmsCampaignsCard } from './RecentSmsCampaignsCard'
import { RecentTeamMembersCard } from './RecentTeamMembersCard'

export function UserChartsAndTables({
  stats,
  weeklyChartOptions,
  weeklyChartSeries,
  campaignChartOptions,
  campaignChartSeries,
  cardVariants,
  t
}: UserChartsAndTablesProps) {
  return (
    <div className="space-y-8">
      {/* 3. Third Section (2-Column Grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <RecentCampaignsCard stats={stats} cardVariants={cardVariants} t={t} />
        <RecentSmsCampaignsCard stats={stats} cardVariants={cardVariants} t={t} />
      </div>

      {/* 4. Fourth Section (3-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        <DashboardChartCard
          title={t('weekly_call_history')}
          category={t('desc_weekly_call_history', 'Analyze daily volume of inbound and outbound traffic.')}
          badgeText={t('active')}
          badgeIcon={TrendingUp}
          badgeColorClass="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          chartType="area"
          chartOptions={weeklyChartOptions}
          chartSeries={weeklyChartSeries}
          height={320}
        />

        <RecentContactsCard stats={stats} cardVariants={cardVariants} t={t} />

        <DashboardChartCard
          title={t('campaign_chart')}
          category={t('desc_campaign_chart', 'Visualize frequency and volume of outbound campaigns.')}
          badgeText={t('weekly')}
          badgeIcon={Megaphone}
          badgeColorClass="bg-amber-500/10 text-amber-500 border border-amber-500/20"
          chartType="bar"
          chartOptions={campaignChartOptions}
          chartSeries={campaignChartSeries}
          height={320}
        />
      </div>

      {/* 5. Fifth Section (2-Column Grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <RecentTeamMembersCard stats={stats} cardVariants={cardVariants} t={t} />
        <RecentActivityCard stats={stats} cardVariants={cardVariants} t={t} />
      </div>
    </div>
  )
}
