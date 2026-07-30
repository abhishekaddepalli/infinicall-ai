'use client'

import { Button } from '@/components/ui/button'
import { sidebarMenuData } from '@/data/sidebarData'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar } from '@/redux/slices/layoutSlice'
import { SidebarProps } from '@/types/layout'
import { ChevronLeft, X } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { SidebarProvider } from './SidebarContext'
import SidebarItem from './SidebarItem'
import SidebarLogo from './SidebarLogo'

const Sidebar = ({ isMobile, onClose, onLogoClick }: SidebarProps) => {
  const dispatch = useAppDispatch()
  const { isSidebarCollapsed } = useAppSelector((state) => state.layout)
  const isExpanded = isMobile || !isSidebarCollapsed

  const { hasPermission, hasAnyPermission, role } = usePermission()

  const filteredMenuData = sidebarMenuData.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (item.requiredRole === 'super_admin' && role !== 'super_admin') return false
      if (item.requiredRole === 'admin' && role !== 'admin' && role !== 'super_admin') return false
      if (item.hideForAdmin && role === 'super_admin') return false
      if (item.hideForAdmin && role === 'admin') return false
      if (item.hideForAdmin && role === 'admin') return false

      if (item.requiredPermissions) {
        return hasAnyPermission(item.requiredPermissions)
      }

      if (item.requiredPermission) {
        return hasPermission(item.requiredPermission)
      }

      return true
    }).map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (child.requiredRole === 'super_admin' && role !== 'super_admin') return false
            if (child.requiredRole === 'admin' && role !== 'admin' && role !== 'super_admin') return false
            if (child.hideForAdmin && role === 'super_admin') return false
            if (child.hideForAdmin && role === 'admin') return false
            if (child.hideForAdmin && role === 'admin') return false

            if (child.requiredPermissions) return hasAnyPermission(child.requiredPermissions)
            if (child.requiredPermission) return hasPermission(child.requiredPermission)
            return true
          })
        }
      }
      return item
    })
  })).filter(section => section.items.length > 0)

  return (
    <aside
      className={cn(
        "bg-sidebar-bg backdrop-blur-xl h-full flex flex-col relative transition-all duration-500 ease-in-out",
        isExpanded ? 'w-66.25' : 'w-[55px]',
        isMobile ? 'w-66.25 rounded-none' : 'rounded-tl-2xl rtl:rounded-tl-none rtl:rounded-tr-2xl'
      )}
    >
      {isMobile && onClose && (
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute right-4 rtl:right-auto rtl:left-4 top-5 z-50 w-9 h-9 p-0! text-slate-500 dark:text-slate-400 hover:bg-destructive/20 hover:text-destructive dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      {!isMobile && (
        <Button
          onClick={() => dispatch(toggleSidebar())}
          variant="ghost"
          className={cn(
            'absolute -right-3 rtl:right-auto rtl:-left-3 top-3 z-40 w-2! h-2 p-3! rounded-full text-primary border border-input-border-color dark:border-white/10 bg-bg-card dark:bg-input-dark-bg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center',
            isSidebarCollapsed ? 'rotate-180 rtl:rotate-0' : 'rtl:rotate-180'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      <SidebarProvider>
        <div className="flex flex-col h-full">
          {isMobile && (
            <SidebarLogo isCollapsed={!isExpanded} onClick={onLogoClick} />
          )}

          <nav className={cn(
            'flex-1 px-4 pb-6 overflow-y-auto no-scrollbar transition-all duration-300',
            isExpanded ? 'space-y-5' : 'px-2 space-y-1',
            !isMobile && 'pt-4'
          )}>
            {filteredMenuData.map((section) => (
              <div key={section.title} className={cn("mb-0 transition-all duration-300", isExpanded ? "space-y-1" : "space-y-0")}>
                <SectionHeader label={section.title} isCollapsed={!isExpanded} />
                <div className="space-y-1 mb-2">
                  {section.items.map((item) => (
                    <SidebarItem key={item.id} item={item} isCollapsed={!isExpanded} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Optional Footer Section */}
          {/* {!isExpanded ? (
            <div className="p-4 flex justify-center border-t border-sidebar-border mt-auto">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : (
            <div className="p-4 border-t border-sidebar-border mt-auto">
              <div className="flex items-center gap-3 rounded-xl transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                  {role?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">User Name</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </SidebarProvider>
    </aside>
  )
}

export default Sidebar
