'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { iconMap, sidebarMenuData } from '@/data/sidebarData'
import { usePermission } from '@/hooks/usePermission'
import { GlobalSearchProps, MenuItem, MenuSection } from '@/types/layout'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const GlobalSearch = ({ isMobile = false }: GlobalSearchProps) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { hasPermission, hasAnyPermission, role } = usePermission()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (!isMobile) {
      if (value.trim().length > 0) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
  }

  const allItems = sidebarMenuData.flatMap((section: MenuSection) => section.items)

  const filteredItems = allItems.filter((item: MenuItem) => {
    // Permission check
    if (item.requiredRole === 'super_admin' && role !== 'super_admin') return false
    if (item.hideForAdmin && role === 'super_admin') return false
    if (item.hideForAdmin && role === 'admin') return false
    if (item.requiredPermissions && !hasAnyPermission(item.requiredPermissions)) return false
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) return false

    const labelStr = t(item.label) || item.label;
    return labelStr.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleItemClick = () => {
    setIsOpen(false)
    setIsMobileOpen(false)
    setSearchQuery('')
  }

  const renderResults = () => {
    if (isMobile && searchQuery.trim().length === 0) {
      return (
        <div className="p-8 text-center">
          <Search className="w-8 h-8 text-slate-200 dark:text-white/10 mx-auto mb-3" />
          <p className="text-sm text-slate-400 dark:text-white/50">
            {t('Type to search') || 'Type to search...'}
          </p>
        </div>
      )
    }

    if (filteredItems.length === 0) {
      return (
        <div className="p-8 text-center">
          <Search className="w-10 h-10 text-slate-200 dark:text-white/10 mx-auto mb-3" />
          <p className="text-sm text-slate-400 dark:text-white/50">
            {t('no_results_found') || `No results found for "${searchQuery}"`}
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-1">
        {filteredItems.map((item: any) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Search;
          return (
            <Link
              href={item.path}
              key={item.id}
              onClick={handleItemClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-radius hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-radius bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/50 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-md font-semibold text-title truncate group-hover:text-primary transition-colors">
                  {t(item.label)}
                </span>
                <span className="text-sm text-subtitle-color mt-0.5 truncate flex items-center gap-1">
                  {item.path}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  if (isMobile) {
    return (
      <DropdownMenu open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-300"
          >
            <Search className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[320px] p-2 bg-bg-card border-input-border-color shadow-xl rounded-2xl z-50">
          <div className="flex items-center h-11 bg-white/5 dark:bg-white/5 border border-input-border-color! rounded-radius px-3 mb-2 focus-within:border-white/20">
            <Search className="w-5 h-5 text-subtitle-color shrink-0" />
            <Input
              type="text"
              autoFocus
              placeholder={t('search_placeholder') || "Search anything..."}
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent h-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-md! text-title placeholder:text-subtitle-color w-full ml-3 rtl:ml-0 rtl:mr-3"
            />
          </div>
          <div className="max-h-[350px] overflow-y-auto no-scrollbar rounded-xl">
            {renderResults()}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div ref={wrapperRef} className="relative flex items-center w-full max-w-[500px]">
      <div className="flex w-full items-center h-10 dark:bg-white/5 bg-white/10 rounded-radius px-4 py-2 group transition-all duration-300 focus-within:bg-white/15 focus-within:border-white/20">
        <Search className="w-5 h-5 text-white/50 shrink-0" />
        <Input
          type="text"
          placeholder={t('search_placeholder') || "Search anything..."}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchQuery.trim().length > 0) setIsOpen(true)
          }}
          className="bg-transparent h-10 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-md! text-white placeholder:text-white/40 w-full ml-3 rtl:ml-0 rtl:mr-3"
        />
      </div>

      {isOpen && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-bg-card border border-slate-200 dark:border-white/10 rounded-radius max-h-[480px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 shadow-lg">
          <div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <span className="text-sm font-bold text-slate-600 dark:text-white/70 px-3">Search Results</span>
          </div>
          <div className="p-2 overflow-y-auto max-h-[300px] no-scrollbar">
            {renderResults()}
          </div>
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
