import {
  CreatePhoneNumberPayload,
  PhoneNumberListResponse,
  PhoneNumberMutationResponse,
  UpdatePhoneNumberPayload
} from '@/types/phone-number';
import { ImportSipPhoneNumberPayload } from '@/types/sip-trunk';
import { baseApi } from './baseApi';

export const phoneNumberApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPhoneNumbers: builder.query<PhoneNumberListResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/phone-numbers',
        params,
      }),
      providesTags: ['PhoneNumber'],
    }),
    loadFromTwilio: builder.mutation<PhoneNumberMutationResponse, void>({
      query: () => ({
        url: '/phone-numbers/load-twilio',
        method: 'GET',
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    loadFromPlivo: builder.mutation<PhoneNumberMutationResponse, void>({
      query: () => ({
        url: '/phone-numbers/load-plivo',
        method: 'GET',
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    loadFromVobiz: builder.mutation<PhoneNumberMutationResponse, void>({
      query: () => ({
        url: '/phone-numbers/load-vobiz',
        method: 'GET',
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    addPhoneNumber: builder.mutation<PhoneNumberMutationResponse, CreatePhoneNumberPayload>({
      query: (data) => ({
        url: '/phone-numbers/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    updatePhoneNumber: builder.mutation<PhoneNumberMutationResponse, { id: string; data: UpdatePhoneNumberPayload }>({
      query: ({ id, data }) => ({
        url: `/phone-numbers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    updatePurchasePrice: builder.mutation<PhoneNumberMutationResponse, { id: string; data: { purchase_price: number; validity_days: number } }>({
      query: ({ id, data }) => ({
        url: `/phone-numbers/${id}/purchase-price`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    deletePhoneNumber: builder.mutation<PhoneNumberMutationResponse, string>({
      query: (id) => ({
        url: `/phone-numbers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    syncToElevenLabs: builder.mutation<PhoneNumberMutationResponse, string>({
      query: (id) => ({
        url: `/phone-numbers/${id}/sync-elevenlabs`,
        method: 'POST',
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
    importSipPhoneNumber: builder.mutation<PhoneNumberMutationResponse, ImportSipPhoneNumberPayload>({
      query: (body) => ({
        url: '/phone-numbers/import-sip',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PhoneNumber'],
    }),
  }),
});

export const {
  useGetPhoneNumbersQuery,
  useLoadFromTwilioMutation,
  useLoadFromPlivoMutation,
  useLoadFromVobizMutation,
  useAddPhoneNumberMutation,
  useUpdatePhoneNumberMutation,
  useUpdatePurchasePriceMutation,
  useDeletePhoneNumberMutation,
  useSyncToElevenLabsMutation,
  useImportSipPhoneNumberMutation,
} = phoneNumberApi;
