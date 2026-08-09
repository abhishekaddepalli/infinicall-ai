'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scrollArea'
import { notificationApi, useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from '@/redux/api/notificationApi'
import { useAppDispatch } from '@/redux/hooks'
import { socketService } from '@/services/socketService'
import { Notification } from '@/types/notification'
import { Bell, CheckCircle2, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NotificationDropdown() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetNotificationsQuery()
  const [markAllAsRead] = useMarkAllAsReadMutation()
  const [markNotificationAsRead] = useMarkAsReadMutation()

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  useEffect(() => {
    socketService.connect()

    const unsubscribe = socketService.onNotification((newNotification: Notification) => {
      dispatch(
        notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
          draft.notifications.unshift(newNotification)
          draft.unreadCount += 1
        })
      )
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch])

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await markAllAsRead().unwrap()
    } catch (error) {
      console.error('Failed to mark as read', error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.is_read) return
    try {
      await markNotificationAsRead(
        notification._id || notification.id
      ).unwrap()
      let remainingUnread = 0
      dispatch(
        notificationApi.util.updateQueryData(
          'getNotifications',
          undefined,
          (draft) => {
            const item = draft.notifications.find(
              (n) =>
                (n._id || n.id) ===
                (notification._id || notification.id)
            )
            if (item && !item.is_read) {
              item.is_read = true
              draft.unreadCount -= 1
            }

            remainingUnread = draft.unreadCount
          }
        )
      )
      if (remainingUnread === 0) {
        setIsOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getNotificationIcon = (type?: string, title?: string) => {
    const isSMS = type?.toLowerCase() === 'sms' || title?.toLowerCase().includes('sms');
    return isSMS ? MessageSquare : CheckCircle2;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative flex w-9 h-9 sm:w-10 sm:h-10 p-2 sm:p-2.5 rounded-lg transition-all duration-200 cursor-pointer text-white/80">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-transparent rounded-full text-[10px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[318px] sm:w-[480px] p-0 rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.15)]! dark:shadow-[0_0_24px_rgba(255,255,255,0.05)] overflow-hidden border border-input-border-color! bg-bg-card" sideOffset={8}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-input-border-color!">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-title">
              {t('notifications', 'Notifications')}
            </h3>
            {unreadCount > 0 && (
              <Badge className="bg-blue-50 text-primary hover:bg-blue-50 hover:text-primary dark:bg-primary/20 dark:text-primary rounded-full px-3 py-0.5 text-xs font-bold border-none">
                {unreadCount} {t('unread', 'Unread')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                className="text-sm font-bold p-0! bg-[unset] text-primary hover:text-primary/80 transition-colors"
              >
                {t('mark_all_as_read', 'Mark all as read')}
              </Button>
            )}

          </div>
        </div>

        <ScrollArea className="max-h-[400px] overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="p-4 sm:p-8 text-center text-sm font-medium text-slate-500">{t('loading_notifications')}</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 sm:p-8 text-center text-sm font-medium text-slate-500">{t('no_notification')}</div>
          ) : (
            <div className="flex flex-col py-2 px-3 gap-2">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type, notification.title);
                return (
                  <DropdownMenuItem
                    key={notification._id || notification.id}
                    className={`relative rounded-lg p-2! cursor-pointer flex items-start gap-4 transition-all duration-200 border border-transparent
                    ${!notification.is_read
                        ? "bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20"
                        : "bg-transparent hover:bg-slate-50 dark:hover:bg-white/5"
                      }
                  `}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleNotificationClick(notification);
                    }}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${!notification.is_read ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {!notification.is_read && (
                        <span className="absolute 0 right-0 top-0 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-edit opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-edit border-2 border-white dark:border-bg-card"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className={`text-md truncate ${!notification.is_read ? 'font-bold text-title' : 'font-semibold text-title'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs font-medium text-subtitle-color whitespace-nowrap shrink-0 mt-0.5">
                          {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className={`text-sm break-words whitespace-normal leading-relaxed line-clamp-2 ${!notification.is_read ? 'text-title font-medium' : 'text-subtitle-color'}`}>
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs font-medium text-subtitle-color">
                        {new Date(notification.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </div>
          )}
        </ScrollArea>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
