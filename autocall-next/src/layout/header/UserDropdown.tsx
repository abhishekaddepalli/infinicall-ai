'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/constants/routes'
import { useLogoutMutation } from '@/redux/api/authApi'
import { baseApi } from '@/redux/api/baseApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearAuth } from '@/redux/slices/authSlice'
import { authUtils } from '@/utils/auth'
import { Compass, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const UserDropdown = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isLoading: isAuthLoading } = useAppSelector((state) => state.auth)
  const direction = useAppSelector((state) => state.layout.direction)

  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout().unwrap()
      authUtils.clearAuth()
      dispatch(clearAuth())
      dispatch(baseApi.util.resetApiState())
      setShowLogoutDialog(false)
      router.replace('/')
      toast.success(t('logged_out_successfully') || 'Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      authUtils.clearAuth()
      dispatch(clearAuth())
      dispatch(baseApi.util.resetApiState())
      setShowLogoutDialog(false)
      router.replace('/')
      toast.success(t('logged_out_successfully') || 'Logged out successfully')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <DropdownMenu dir={direction}>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-9 h-9 rounded-radius transition-all duration-300">
            {isAuthLoading ? (
              <AvatarFallback className="bg-white/10 animate-pulse" />
            ) : (
              <>
                <AvatarImage src={user?.avatar || ''} className="object-cover" />
                <AvatarFallback className="bg-primary text-white font-bold text-md">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 mt-2 p-1.5 rounded-lg bg-bg-card  backdrop-blur-xl border border-input-border-color dark:border-white/10 shadow-2xl! animate-in fade-in zoom-in-95 duration-200">
          <div className="px-2 py-3 mb-1 bg-gray-50/50 dark:bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 rounded-lg">
                <AvatarImage src={user?.avatar || ''} />
                <AvatarFallback className="bg-primary text-white font-bold rounded-lg text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-base font-bold text-title truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-subtitle-color truncate font-medium">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-white/5" />

          <DropdownMenuItem asChild className="rounded-lg mt-1 cursor-pointer">
            <Link href={ROUTES.PROFILE} className="flex items-center w-full px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="h-4 w-4" />
              </div>
              <span className="text-md font-medium text-title-color">{t('profile') || 'My Profile'}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
            <Link href={ROUTES.EXPLORE} className="flex items-center w-full px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-md font-medium text-title-color">{t('explore') || 'Explore'}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-white/5" />

          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="rounded-lg mt-1 px-3 py-2.5 text-red-500 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-400/10 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{t('sign_out') || 'Sign Out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[525px]! max-w-[calc(100%-2rem)]! border-none sm:p-6 p-4">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-title">{t('sign_out') || 'Sign Out'}</DialogTitle>
            <DialogDescription className="text-center">
              {t('sign_out_confirm') || 'Are you sure you want to sign out?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-4 sm:space-x-0">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} className='h-11 bg-subcard! p-padding! focus:outline-none focus-visible:ring-0 focus:ring-0 border border-input-border-color'>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut} className='h-11 border border-input-border-color bg-destructive dark:bg-destructive text-white hover:bg-destructive! focus:outline-none focus-visible:ring-0 focus:ring-0'>
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : (t('sign_out') || 'Sign Out')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserDropdown

