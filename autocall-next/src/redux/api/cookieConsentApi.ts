import { baseApi } from '../api/baseApi';

export const cookieConsentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveCookieConsent: builder.mutation<any, any>({
      query: (data) => ({
        url: '/cookie/consent',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSaveCookieConsentMutation } = cookieConsentApi;
