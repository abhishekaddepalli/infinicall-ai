import { baseApi } from './baseApi'

export const userSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserSettings: builder.query({
      query: () => ({
        url: '/user-setting',
      }),
      providesTags: ['UserSettings'],
    }),
    updateUserSettings: builder.mutation({
      query: (data) => ({
        url: '/user-setting/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UserSettings'],
    }),
  }),
})

export const { useGetUserSettingsQuery, useUpdateUserSettingsMutation } = userSettingApi
