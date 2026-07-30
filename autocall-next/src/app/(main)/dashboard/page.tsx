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

  if (isError) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold bg-rose-500/10 rounded-3xl border border-rose-500/20 animate-in fade-in duration-500">
        {t('failed_to_load_stats')}
      </div>
    )
  }

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

      {isPrivileged && adminStats && <AdminDashboard stats={adminStats} />}
      {isTeam && teamStats && <TeamMemberDashboard stats={teamStats} onSearchChange={handleSearchChange} />}
      {isRegularUser && userStats && <UserDashboard stats={userStats} />}
    </div>
  )
}

export default DashboardPage
