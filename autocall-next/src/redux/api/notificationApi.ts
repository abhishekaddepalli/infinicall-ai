import { GetNotificationsResponse } from '@/types/notification'
import { baseApi } from './baseApi'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/notifications/all/read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} = notificationApi
