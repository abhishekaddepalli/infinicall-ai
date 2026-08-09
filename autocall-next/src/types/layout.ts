import { ReactNode } from 'react'

export interface DashboardLayoutProps {
  children: ReactNode
}

export interface MenuItem {
  id: string
  label: string
  icon: string
  path?: string
  badge?: string
  requiredPermission?: string
  requiredPermissions?: string[]
  requiredRole?: string
  hideForAdmin?: boolean
  children?: MenuItem[]
}

export interface MenuSection {
  title: string
  items: MenuItem[]
}

export interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
  onLogoClick?: () => void
}

export interface HeaderProps {
  onMenuToggle: () => void
}

export interface ExtendedSectionHeaderProps {
  label: string
  isCollapsed?: boolean
}

export interface SidebarContextType {
  openMenuId: string | null
  setOpenMenuId: (id: string | null) => void
}

export interface ExtendedSidebarItemProps {
  item: MenuItem
  depth?: number
  isCollapsed?: boolean
  isLast?: boolean
}

export interface GlobalSearchProps {
  isMobile?: boolean
}

export interface CookiePreferences {
  essential: boolean;
  call_history: boolean;
  ai_personalization: boolean;
  analytics: boolean;
}

export interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: CookiePreferences;
  onToggle: (key: keyof CookiePreferences) => void;
  onSave: (preferences: CookiePreferences) => void;
  onCancel: () => void;
}

export interface VisualPanelProps {
  className?: string;
}
