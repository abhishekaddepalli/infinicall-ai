import { baseApi } from './baseApi'

export const creditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreditBalance: builder.query<any, void>({
      query: () => ({
        url: '/credits/balance',
      }),
      providesTags: ['Dashboard'],
    }),
    getCreditUsageHistory: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/credits/usage-history',
        params: params || {},
      }),
      providesTags: ['Dashboard'],
    }),
    getCreditStatistics: builder.query<any, void>({
      query: () => ({
        url: '/credits/statistics',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetCreditBalanceQuery,
  useGetCreditUsageHistoryQuery,
  useGetCreditStatisticsQuery,
} = creditApi
