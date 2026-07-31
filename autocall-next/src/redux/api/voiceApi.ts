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
    synthesizeSpeech: builder.mutation<{ success: boolean; data: { url: string } }, { text: string; voice_id: string }>({
      query: (body) => ({
        url: '/voices/synthesize',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetVoicesQuery,
  useSyncVoicesMutation,
  useSynthesizeSpeechMutation,
} = voiceApi
