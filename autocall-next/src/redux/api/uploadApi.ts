import { UploadResponse } from '@/types/landing'
import { baseApi } from './baseApi'

export const uploadApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const { useUploadImageMutation } = uploadApi
