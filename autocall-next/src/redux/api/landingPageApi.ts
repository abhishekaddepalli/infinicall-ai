import { baseApi } from './baseApi'

export const landingPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandingPage: builder.query({
      query: () => ({
        url: '/landing-page',
      }),
      providesTags: ['LandingPage'],
    }),
    updateLandingPage: builder.mutation({
      query: (data) => ({
        url: '/landing-page',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
  }),
})

export const { useGetLandingPageQuery, useUpdateLandingPageMutation } = landingPageApi
