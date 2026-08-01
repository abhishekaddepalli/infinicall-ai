'use client'

import { AdminDashboard, AdminDashboardSkeleton, TeamMemberDashboard, TeamMemberDashboardSkeleton, UserDashboard, UserDashboardSkeleton } from '@/components/features/dashboard'
import { DashboardDateFilter } from '@/components/features/dashboard/components/DashboardDateFilter'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminDashboardStatsQuery, useGetTeamMemberDashboardStatsQuery, useGetUserDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DashboardPage = () => {
  const { isAdmin, isTeamMember, isLoading: isAuthLoading } = usePermission()
  const { t } = useTranslation()

  const isPrivileged = isAdmin()
  const isTeam = isTeamMember()
  const isRegularUser = !isPrivileged && !isTeam

  const [filters, setFilters] = useState<{ dateRange: string; startDate?: string; endDate?: string, search?: string }>({
    dateRange: "this_year",
  });

  const {
    data: adminResponse,
    isLoading: isAdminLoading,
    isError: isAdminError,
  } = useGetAdminDashboardStatsQuery(filters, { skip: isAuthLoading || !isPrivileged })

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserDashboardStatsQuery(filters, { skip: isAuthLoading || !isRegularUser })

  const {
    data: teamResponse,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useGetTeamMemberDashboardStatsQuery(filters, { skip: isAuthLoading || !isTeam })

  const isLoading = isAuthLoading || (isPrivileged ? isAdminLoading : isTeam ? isTeamLoading : isUserLoading)
  const isError = isPrivileged ? isAdminError : isTeam ? isTeamError : isUserError
  
  const adminStats = adminResponse?.data
  const userStats = userResponse?.data
  const teamStats = teamResponse?.data

  const dashboardTitle = isPrivileged ? "Performance Dashboard" : isTeam ? "Team Overview" : "Performance Overview";

  const handleSearchChange = useCallback((search: string) => {
    setFilters(prev => {
      if (prev.search === search) return prev;
      return { ...prev, search }
    })
  }, [])

  if (isLoading) {
    if (isPrivileged) return <AdminDashboardSkeleton />
    if (isTeam) return <TeamMemberDashboardSkeleton />
    return <UserDashboardSkeleton />
  }

  const defaultAdminStats = {
    statistics: {
      newUsersThisWeek: 0, totalRevenue: 0, activeSubscribers: 0, totalFlowsOfCurrentUser: 0,
      totalTemplatesOfCurrentUser: 0, totalContactOfCurrentUser: 0, totalAgentOfCurrentUser: 0,
      totalSmsAgentOfCurrentUser: 0, totalTeamsAcrossAllUser: 0, totalSmsTemplateOfCurrentUser: 0,
      totalCallsOfCurrentUser: 0, totalCampaignsOfCurrentUser: 0, totalSmsCampaignOfCurrentUser: 0
    },
    charts: { monthWiseRevenueChart: [], currentWeekCallChart: [], allTimeAgentPieChart: { all_agent: 0, agent: 0, sms_agent: 0 } },
    tables: { recentRegisteredUsers: [], recentCallsOfCurrentUser: [], recentCampaigns: [], systemFlow: [], recentSmsCampaignsOfCurrentUser: [], recentContactOfCurrentUser: [] }
  }

  const defaultUserStats = {
    statistics: { totalAppointmentsBooked: 0, totalFormSubmissions: 0, totalKnowledgebase: 0, totalTemplatesCreated: 0, totalContacts: 0, totalFlowsCreated: 0, totalAiAgent: 0, totalSmsAgents: 0, totalActiveCampaigns: 0, totalActiveSmsCampaigns: 0, campaignsUsedToday: 0, totalCalls: 0 },
    charts: { currentWeekCallChart: [], allTimeCallPieChart: { all_call: 0, incoming: 0, outgoing: 0 }, currentWeekCampaignChart: [] },
    tables: { recentCampaigns: [], recentContacts: [], recentSmsCampaigns: [], recentTeamMembers: [], recentActivity: [] },
    credits: { remainingCredits: 0, totalCreditsUsed: 0, creditDeductionType: 'per_call' }
  }

  const defaultTeamStats = {
    statistics: { totalTransferredCalls: 0, successCalls: 0, failedCalls: 0, successRate: 0, failedRate: 0, totalDuration: 0 },
    tables: { recentTransferredCalls: [] }
  }

  const activeAdminStats = adminStats || defaultAdminStats
  const activeUserStats = userStats || defaultUserStats
  const activeTeamStats = teamStats || defaultTeamStats

  return (
    <div className="space-y-6">
      <div className="-mx-4 sm:-mx-8 pt-0! px-4 sm:px-8 py-4 sm:py-6 transition-all duration-300 mb-0!">
        <div className="flex justify-between items-center flex-wrap gap-3 sm:gap-0">
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-title-color tracking-tight">{dashboardTitle}</h4>
          </div>
          <div className="flex justify-end!! items-center gap-4">
            {!isTeam && <DashboardDateFilter onFilterChange={setFilters} />}
          </div>
        </div>
      </div>

      {isPrivileged && <AdminDashboard stats={activeAdminStats} />}
      {isTeam && <TeamMemberDashboard stats={activeTeamStats} onSearchChange={handleSearchChange} />}
      {isRegularUser && <UserDashboard stats={activeUserStats} />}
    </div>
  )
}

export default DashboardPage
