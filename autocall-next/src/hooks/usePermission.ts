'use client'

import { useAppSelector } from '@/redux/hooks'

export const usePermission = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const userPermissions = user?.permissions || user?.permissionSlugs || []
  const userRole = user?.role || 'user'

  const hasPermission = (permissionName: string): boolean => {
    // API Keys/APIs are essential for all users - granting default access
    if (permissionName === 'View API Keys' || permissionName === 'Manage APIs') return true

    return userPermissions.some(p => {
      if (typeof p === 'string') return p === permissionName
      // Handle legacy object structure if necessary
      return (p as any).slug === permissionName || (p as any).name === permissionName
    })
  }

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(p => hasPermission(p))
  }

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(p => hasPermission(p))
  }

  const isAdmin = () => userRole === 'admin' || userRole === 'super_admin'
  const isAgent = () => userRole === 'agent'
  const isAssigner = () => userRole === 'assigner'
  const isTeamMember = () => userRole === 'team_member'

  return {
    user,
    isAuthenticated,
    isLoading,
    permissions: userPermissions,
    role: userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isAgent,
    isAssigner,
    isTeamMember,
  }
}
