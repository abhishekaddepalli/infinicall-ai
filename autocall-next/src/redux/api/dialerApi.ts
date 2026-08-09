import { baseApi } from './baseApi';
import { DialerTokenRequest, DialerTokenResponse } from '@/types/dialer';

export const dialerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateDialerToken: builder.mutation<DialerTokenResponse, DialerTokenRequest>({
      query: (data) => ({
        url: '/dialer/token',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGenerateDialerTokenMutation } = dialerApi;
