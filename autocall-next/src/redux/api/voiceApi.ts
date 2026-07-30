import { VoiceResponse } from '@/types/voice';
import { baseApi } from './baseApi'

export const voiceApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVoices: builder.query<VoiceResponse, void>({
      query: () => ({
        url: '/voices',
      }),
      providesTags: ['Voice'],
    }),
    syncVoices: builder.mutation<{ success: boolean; message: string; data?: any }, void>({
      query: () => ({
        url: '/voices/sync',
        method: 'GET',
      }),
      invalidatesTags: ['Voice'],
    }),
  }),
})

export const {
  useGetVoicesQuery,
  useSyncVoicesMutation,
} = voiceApi
