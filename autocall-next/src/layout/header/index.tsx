'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import useSettings from '@/hooks/useSettings'
import { HeaderProps } from '@/types/layout'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import DirectionToggle from './DirectionToggle'
import CreditBalanceDropdown from './CreditBalanceDropdown'
import GlobalSearch from './GlobalSearch'
import LanguageDropdown from './LanguageDropdown'
import NotificationDropdown from './NotificationDropdown'
import ThemeToggle from './ThemeToggle'
import UserDropdown from './UserDropdown'

const HeaderLogo = () => {
  const { settings, isLoading } = useSettings()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const faviconUrl = useMemo(() => {
    if (!mounted) return null
    const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? ''
    const url = settings?.favicon_url
    if (!url) return '/light-logo.png'
    if (url.startsWith('http')) return url
    const base = API_URL.replace(/\/$/, '')
    const path = url.replace(/^\//, '')
    if (!base) return `/${path}`
    return `${base}/${path}`
  }, [mounted, settings])

  if (!mounted || isLoading) {
    return <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
  }

  return (
    <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5 no-underline group shrink-0">
      <Image
        src={faviconUrl || '/light-logo.png'}
        alt={settings?.app_name || 'Logo'}
        width={170}
        height={70}
        unoptimized
        className="object-contain w-[170px] h-[70px]"
      />
    </Link>
  )
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const { isAdmin, isTeamMember } = usePermission()

  return (
    <header className="sticky top-0 z-40 bg-header transition-all duration-300">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Button
            onClick={onMenuToggle}
            variant="ghost"
            size="icon"
            className="min-[992px]:hidden hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden min-[992px]:block">
            <HeaderLogo />
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 hidden md:flex justify-start lg:px-15 px-4">
          <GlobalSearch />
        </div>

        {/* Right: Actions + User */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex md:hidden">
            <GlobalSearch isMobile />
          </div>
          {!isAdmin() && !isTeamMember() && <CreditBalanceDropdown />}
          <div className="flex">
            <LanguageDropdown />
          </div>
          <div className="flex">
            <DirectionToggle />
          </div>
          <div className="flex">
            <ThemeToggle />
          </div>
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header
