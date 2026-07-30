'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { TeamMemberProfileProps } from '@/types/team'
import { getMediaUrl } from '@/utils/auth'
import { User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const TeamMemberProfile = ({ user }: TeamMemberProfileProps) => {
  const { t } = useTranslation()
  const displayAvatar = user?.avatar && user.avatar !== 'null' ? getMediaUrl(user.avatar) : null

  return (
    <div className="space-y-6 pb-10">
      {/* Profile Header */}
      <Card className="rounded-lg border border-input-border-color bg-bg-card animate-in fade-in slide-in-from-top duration-500 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-[6px] border-white dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-sm">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={displayAvatar || undefined} className="object-cover" />
                  <AvatarFallback className={cn('text-3xl font-bold', getAvatarColorClass(user?.name))}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              {user?.status === 'active' && (
                <div className="absolute bottom-1 right-1 w-[22px] h-[22px] bg-edit rounded-full border-[4px] border-white dark:border-zinc-800" title={t('active')} />
              )}
            </div>

            <div className="flex flex-col text-left rtl:text-right justify-center">
              <h1 className="text-[28px] font-bold text-title leading-none mb-1.5">
                {user?.name}
              </h1>
              <p className="text-subtitle-color font-bold text-md mb-3">
                <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
              </p>
              
              {user?.status === 'active' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-input-border-color bg-subcard w-fit mt-1">
                  <span className="text-sm font-bold text-title">{t('status')}:</span>
                  <span className="text-sm font-bold text-edit capitalize">{t('active')}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card className="rounded-lg border border-input-border-color bg-bg-card animate-in fade-in slide-in-from-left duration-500 lg:col-span-2">
          <CardHeader className="pb-4 border-b border-input-border-color sm:px-8 px-4 sm:pt-6 pt-4">
            <CardTitle className="text-xl font-bold text-title flex items-center">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3 shrink-0">
                <User className="w-5 h-5" />
              </div>
              {t('contact_information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="sm:px-6 px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-title">{t('full_name')}</Label>
                <div className="font-semibold text-subtitle-color text-sm p-3 rounded-lg border border-input-border-color bg-input-color">
                  {user?.name || t('n_a')}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-title">{t('email_address')}</Label>
                <div className="font-semibold text-subtitle-color text-sm p-3 rounded-lg border border-input-border-color bg-input-color">
                  {user?.email || t('n_a')}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-title">{t('phone_number')}</Label>
                <div className="font-semibold text-subtitle-color text-sm p-3 rounded-lg border border-input-border-color bg-input-color">
                  {user?.phone_number || t('not_provided')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department & Reporting */}
        <Card className="rounded-lg border border-input-border-color bg-bg-card animate-in fade-in slide-in-from-right duration-500 lg:col-span-1">
          <CardHeader className="pb-4 border-b border-input-border-color sm:px-8 px-4 sm:pt-6 pt-4">
            <CardTitle className="text-xl font-bold text-title flex items-center">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3 shrink-0">
                <User className="w-5 h-5" />
              </div>
              {t('department_reporting')}
            </CardTitle>
          </CardHeader>
          <CardContent className="sm:px-6 px-4 py-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-md font-medium text-title">{t('assigned_team')}</Label>
              <div className="flex items-center gap-3 p-3.5 bg-subcard rounded-lg border border-input-border-color">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-title text-md truncate">{user?.teamDetails?.name || t('no_team_assigned')}</span>
                  {user?.teamDetails?.description && (
                    <span className="text-sm font-medium text-subtitle-color truncate">{user.teamDetails.description}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-input-border-color" />

            <div className="space-y-3">
              <Label className="text-sm font-medium text-title">{t('reporting_manager')}</Label>
              <div className="flex items-center gap-3 p-3.5 bg-subcard rounded-lg border border-input-border-color">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-[17px] shrink-0 shadow-sm">
                  {user?.user_id?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-title text-md truncate">{user?.user_id?.name || t('n_a')}</span>
                  <span className="text-sm font-medium text-subtitle-color truncate">{user?.user_id?.email || t('n_a')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
