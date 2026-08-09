import {
  CalendarEvent,
  FetchCalendarsResponse,
  GoogleCalendar,
  GoogleCalendarResponse,
  GoogleCalendarsResponse
} from '@/types/google-workspace';
import { baseApi } from './baseApi';

export const googleCalendarsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGoogleCalendars: builder.query<GoogleCalendarsResponse, void>({
      query: () => ({ url: '/google-calendars' }),
      providesTags: ['GoogleWorkspace'],
    }),
    listUserGoogleCalendars: builder.query<GoogleCalendarsResponse, void>({
      query: () => ({ url: '/google-calendars/list' }),
      providesTags: ['GoogleWorkspace'],
    }),
    getGoogleCalendarById: builder.query<GoogleCalendarResponse, string>({
      query: (id) => ({ url: `/google-calendars/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'GoogleWorkspace', id }],
    }),
    createGoogleCalendar: builder.mutation<{ success: boolean; data: GoogleCalendar }, Partial<GoogleCalendar> & { create_in_google?: boolean }>({
      query: (body) => ({ url: '/google-calendars', method: 'POST', body }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    updateGoogleCalendar: builder.mutation<{ success: boolean; data: GoogleCalendar }, { id: string; data: Partial<GoogleCalendar> }>({
      query: ({ id, data }) => ({ url: `/google-calendars/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    // delete_from passed as query param: ?delete_from=google or ?delete_from=system
    deleteGoogleCalendar: builder.mutation<{ success: boolean; message: string }, { id: string; delete_from: 'system' | 'google' }>({
      query: ({ id, delete_from }) => ({ url: `/google-calendars/${id}?delete_from=${delete_from}`, method: 'DELETE' }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    // delete_from and ids both in request body
    bulkDeleteGoogleCalendars: builder.mutation<{ success: boolean; message: string }, { ids: string[]; delete_from: 'system' | 'google' }>({
      query: (body) => ({ url: '/google-calendars/bulk-delete', method: 'POST', body }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    fetchCalendars: builder.query<FetchCalendarsResponse, string>({
      query: (googleAccountId) => ({ url: `/google-calendars/fetch-calendars/${googleAccountId}` }),
    }),
    linkCalendar: builder.mutation<{ success: boolean; calendar: GoogleCalendar }, string>({
      query: (id) => ({ url: `/google-calendars/${id}/link`, method: 'POST' }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    listEvents: builder.query<{ success: boolean; events: CalendarEvent[] }, { calendarId: string; timeMin?: string; timeMax?: string }>({
      query: ({ calendarId, timeMin, timeMax }) => {
        const params = new URLSearchParams()
        if (timeMin) params.append('timeMin', timeMin)
        if (timeMax) params.append('timeMax', timeMax)
        const qs = params.toString()
        return { url: `/google-calendars/${calendarId}/events${qs ? `?${qs}` : ''}` }
      },
      providesTags: (_result, _err, { calendarId }) => [{ type: 'GoogleWorkspace', id: `CalendarEvents-${calendarId}` }],
    }),
    createEvent: builder.mutation<{ success: boolean; event: CalendarEvent }, { calendarId: string; body: Partial<CalendarEvent> }>({
      query: ({ calendarId, body }) => ({ url: `/google-calendars/${calendarId}/events`, method: 'POST', body }),
      invalidatesTags: (_result, _err, { calendarId }) => [{ type: 'GoogleWorkspace', id: `CalendarEvents-${calendarId}` }],
    }),
    updateEvent: builder.mutation<{ success: boolean; event: CalendarEvent }, { calendarId: string; eventId: string; body: Partial<CalendarEvent> }>({
      query: ({ calendarId, eventId, body }) => ({ url: `/google-calendars/${calendarId}/events/${eventId}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { calendarId }) => [{ type: 'GoogleWorkspace', id: `CalendarEvents-${calendarId}` }],
    }),
    deleteEvent: builder.mutation<{ success: boolean }, { calendarId: string; eventId: string }>({
      query: ({ calendarId, eventId }) => ({ url: `/google-calendars/${calendarId}/events/${eventId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, { calendarId }) => [{ type: 'GoogleWorkspace', id: `CalendarEvents-${calendarId}` }],
    }),
  }),
})

export const {
  useGetGoogleCalendarsQuery,
  useListUserGoogleCalendarsQuery,
  useGetGoogleCalendarByIdQuery,
  useCreateGoogleCalendarMutation,
  useUpdateGoogleCalendarMutation,
  useDeleteGoogleCalendarMutation,
  useBulkDeleteGoogleCalendarsMutation,
  useLazyFetchCalendarsQuery,
  useLinkCalendarMutation,
  useListEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = googleCalendarsApi
