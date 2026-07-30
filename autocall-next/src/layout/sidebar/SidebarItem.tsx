'use client'

import { CustomTooltip } from '@/components/reusable/CustomTooltip'
import { iconMap } from '@/data/sidebarData'
import { cn } from '@/lib/utils'
import { ExtendedSidebarItemProps } from '@/types/layout'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSidebarContext } from './SidebarContext'

const SidebarItem: FC<ExtendedSidebarItemProps> = ({ item, depth = 0, isCollapsed }) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { openMenuId, setOpenMenuId } = useSidebarContext()
  const isTopLevel = depth === 0

  const labelText = item.label.includes('.')
    ? t(item.label)
    : t(`${item.label.toLowerCase().replace(/ /g, '_')}`, { defaultValue: item.label })

  const hasChildren = item.children && item.children.length > 0
  const isActive = item.path === pathname || (item.path !== '/' && pathname.startsWith(item.path + '/')) ||
    (hasChildren && item.children?.some(child => child.path === pathname))
  const defaultOpen = isActive && hasChildren && !isTopLevel;

  const [localIsOpen, setLocalIsOpen] = useState(defaultOpen);
  const isOpen = isTopLevel ? openMenuId === item.id : localIsOpen



  const handleToggle = () => {
    if (!hasChildren) return
    if (isTopLevel) {
      setOpenMenuId(isOpen ? null : item.id)
    } else {
      setLocalIsOpen(!isOpen)
    }
  }

  const IconComponent = iconMap[item.icon as keyof typeof iconMap]

  const ItemContent = (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={hasChildren ? handleToggle : undefined}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-radius transition-all text-sm duration-300 relative cursor-pointer mb-1 w-full',
        isCollapsed && isTopLevel && 'justify-center px-0',
        isActive
          ? depth > 0
            ? 'text-primary border-s-2 border-primary bg-transparent hover:bg-transparent'
            : 'bg-primary text-white'
          : depth > 0
            ? 'text-slate-500 hover:text-primary border-s-2 border-slate-200 bg-transparent hover:bg-transparent'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary',
        depth > 0 && 'ps-6 py-1.5 ms-3 rounded-none mb-0'
      )}
    >
      {/* Active Indicator */}
      {/* {isActive && (
        <motion.div
          layoutId="active-indicator"
          className={cn(
            "absolute left-0 rtl:left-auto rtl:right-0 w-1 h-6 bg-sidebar-active rounded-r-full rtl:rounded-r-none rtl:rounded-l-full transition-all duration-300",
            isCollapsed && isTopLevel && "left-0 rtl:left-auto rtl:right-0"
          )}
        />
      )} */}

      {IconComponent && (
        <IconComponent className={cn(
          'shrink-0 transition-all duration-300',
          isCollapsed ? 'w-4.5 h-4.5' : 'w-4 h-4',
          isActive
            ? depth > 0 ? 'text-primary' : 'text-white'
            : 'group-hover:text-primary text-slate-700 dark:text-slate-200'
        )} />
      )}

      {!isCollapsed && (
        <span className={cn(
          "text-md font-medium flex-1 truncate transition-colors",
          isActive
            ? depth > 0 ? "font-medium text-primary" : "font-semibold text-white"
            : depth > 0
              ? "group-hover:text-primary text-slate-500 dark:text-slate-400"
              : "group-hover:text-primary text-slate-700 dark:text-slate-200"
        )}>
          {labelText}
        </span>
      )}

      {hasChildren && !isCollapsed && (
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(isActive ? "text-primary-foreground/70" : "text-slate-400")}
        >
          <ChevronDown className={cn('w-4 h-4', isActive && depth === 0 ? 'text-white/70' : '')} />
        </motion.div>
      )}
    </motion.div>
  )

  const itemElement = !hasChildren && item.path ? (
    <Link href={item.path} className="no-underline block">
      {ItemContent}
    </Link>
  ) : (
    ItemContent
  )

  return (
    <div className="space-y-1">
      {isCollapsed && isTopLevel ? (
        <CustomTooltip title={labelText} side="right" align="center">
          {itemElement}
        </CustomTooltip>
      ) : (
        itemElement
      )}

      <AnimatePresence>
        {hasChildren && isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {item.children?.map((child, index) => (
              <SidebarItem
                key={child.id}
                item={child}
                depth={depth + 1}
                isCollapsed={isCollapsed}
                isLast={index === (item.children?.length ?? 0) - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SidebarItem
