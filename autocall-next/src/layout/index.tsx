'use client'

import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSidebarCollapsed } from '@/redux/slices/layoutSlice'
import { DashboardLayoutProps } from '@/types/layout'
import { useMemo, useEffect, useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'
import ImpersonationBanner from './ImpersonationBanner'
import { usePermission } from '@/hooks/usePermission'
import { usePathname, useRouter } from 'next/navigation'
import { MenuItem } from '@/types/layout'
import { sidebarMenuData } from '@/data/sidebarData'
import { ROUTES } from '@/constants/routes'
import DataLoader from '@/components/reusable/DataLoader'
import { useGetProfileQuery, useGetTeamMemberProfileQuery } from '@/redux/api/authApi'

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const { user, isAuthenticated, isLoading, hasPermission, role } = usePermission()

  // Determine role — fall back to stored user so we know before the first profile fetch
  const isTeamMemberRole = role === 'team_member'

  // Admin / User: use standard profile endpoint
  const { refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || isTeamMemberRole,
  })

  // Team Member: use dedicated team-member profile endpoint
  const { refetch: refetchTeamMemberProfile } = useGetTeamMemberProfileQuery(undefined, {
    skip: !isAuthenticated || !isTeamMemberRole,
  })

  // Unified refetch function that calls the correct endpoint
  const refetch = isTeamMemberRole ? refetchTeamMemberProfile : refetchProfile

  // Refetch profile on route change to get latest permissions
  useEffect(() => {
    if (isAuthenticated && isMounted) {
      refetch()
    }
  }, [pathname, isAuthenticated, refetch, isMounted])


  // Flatten all menu items to check permissions for the current route
  const allMenuItems = useMemo(() => {
    const items: MenuItem[] = []
    const flatten = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        if (item.path) items.push(item)
        if (item.children) flatten(item.children)
      })
    }
    sidebarMenuData.forEach((section) => flatten(section.items))
    return items
  }, [])

  // Check if the current route is allowed based on sidebar permissions
  const isRouteAllowed = useMemo(() => {
    if (!user || isLoading) return true

    // whitelist routes that are NOT in the sidebar but are valid and allowed
    const HIDDEN_ALLOWED_PATHS = [
      ROUTES.DASHBOARD,
      '/profile',
      '/billing',
    ]
    const isHiddenAllowed = HIDDEN_ALLOWED_PATHS.some(
      (path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)),
    )
    if (isHiddenAllowed) return true

    // Find if the current path matches any sidebar item (or its sub-paths)
    const matchedItem = allMenuItems
      .filter((item) => {
        const basePath = item.path ? item.path.split('?')[0] : ''
        return pathname === basePath || (basePath !== '/' && pathname.startsWith(`${basePath}/`))
      })
      .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))[0]

    if (!matchedItem) return true // Allow routes not defined in sidebar

    // Permission visibility logic
    if (matchedItem.requiredRole === 'super_admin' && role !== 'super_admin') return false
    if (matchedItem.requiredRole === 'admin' && role !== 'admin' && role !== 'super_admin') return false
    if (matchedItem.hideForAdmin && role === 'super_admin') return false
    if (matchedItem.hideForAdmin && role === 'admin') return false
    if (matchedItem.requiredPermission && !hasPermission(matchedItem.requiredPermission)) return false
    if (matchedItem.requiredPermissions && !matchedItem.requiredPermissions.some((p) => hasPermission(p))) return false

    return true
  }, [pathname, allMenuItems, user, isLoading, hasPermission, role])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  // Redirect if not allowed
  useEffect(() => {
    if (isMounted && !isLoading && !isRouteAllowed) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [isRouteAllowed, isLoading, router, isMounted])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push(ROUTES.HOME)
    }
  }, [isLoading, isAuthenticated, router, isMounted])

  const dispatch = useAppDispatch()
  const { isSidebarCollapsed } = useAppSelector((state) => state.layout)

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        dispatch(setSidebarCollapsed(true))
      } else if (window.innerWidth < 1280) {
        dispatch(setSidebarCollapsed(true))
      } else {
        dispatch(setSidebarCollapsed(false))
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dispatch])

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setIsMobileMenuOpen(false)
  }

  if (!isMounted || isLoading || !isAuthenticated || !isRouteAllowed) {
    return <DataLoader fullPage size="md" />
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-header">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm min-[992px]:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-[265px] h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Impersonation Banner */}
      <ImpersonationBanner />

      {/* Header - full width */}
      <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className={cn(
          'hidden min-[992px]:block shrink-0 transition-all duration-500 ease-in-out relative z-30 h-full',
          isSidebarCollapsed ? 'w-[55px]' : 'w-[265px]'
        )}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:px-6 sm:pt-6 sm:pb-2 bg-bg-body">
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
