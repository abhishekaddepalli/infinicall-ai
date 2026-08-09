import { AppointmentListResponse, AppointmentMutationResponse, AppointmentSetting, AppointmentSettingMutationResponse, AppointmentSettingResponse } from '@/types/appointment';
import { baseApi } from './baseApi';

export const appointmentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAppointments: builder.query<AppointmentListResponse, { status?: string; date?: string; range?: string; page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string } | void>({
      query: (params) => ({
        url: '/appointments',
        params: params || {},
      }),
      providesTags: ['Appointments'],
    }),
    updateAppointmentStatus: builder.mutation<AppointmentMutationResponse, { id: string; status: string; appointment_date?: string; appointment_time?: string }>({
      query: ({ id, ...body }) => ({
        url: `/appointments/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    getAppointmentSetting: builder.query<AppointmentSettingResponse, void>({
      query: () => ({
        url: '/appointment-setting',
      }),
      providesTags: ['UserSettings'],
    }),
    updateAppointmentSetting: builder.mutation<AppointmentSettingMutationResponse, AppointmentSetting>({
      query: (settings) => ({
        url: '/appointment-setting',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['UserSettings'],
    }),
  }),
})

export const {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useGetAppointmentSettingQuery,
  useUpdateAppointmentSettingMutation,
} = appointmentApi
