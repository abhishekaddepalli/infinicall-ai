import { baseApi } from './baseApi'

export const impersonationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startImpersonation: builder.mutation<any, { targetUserId: string }>({
      query: (data) => ({
        url: '/impersonate/start',
        method: 'POST',
        body: data,
      }),
    }),
    stopImpersonation: builder.mutation<any, void>({
      query: () => ({
        url: '/impersonate/stop',
        method: 'POST',
      }),
    }),
    getImpersonationStatus: builder.query<any, void>({
      query: () => '/impersonate/status',
    }),
    getAvailableUsersToImpersonate: builder.query<any, void>({
      query: () => '/impersonate/available-users',
    }),
  }),
})

export const {
  useStartImpersonationMutation,
  useStopImpersonationMutation,
  useGetImpersonationStatusQuery,
  useGetAvailableUsersToImpersonateQuery,
} = impersonationApi
