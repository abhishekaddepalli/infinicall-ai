'use client'

import { useGetProfileQuery, useGetTeamMemberProfileQuery } from '@/redux/api/authApi'
import { useAppSelector } from '@/redux/hooks'

export const useProfile = () => {
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isTeamMember = user?.role === 'team_member' || user?.isTeamMember === true

  // Standard profile — Admin / User
  const profileQuery = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || isTeamMember,
  })

  // Team Member profile
  const teamMemberProfileQuery = useGetTeamMemberProfileQuery(undefined, {
    skip: !isAuthenticated || !isTeamMember,
  })

  if (isTeamMember) {
    return {
      data: teamMemberProfileQuery.data,
      isLoading: teamMemberProfileQuery.isLoading,
      isFetching: teamMemberProfileQuery.isFetching,
      refetch: teamMemberProfileQuery.refetch,
    }
  }

  return {
    data: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    refetch: profileQuery.refetch,
  }
}
