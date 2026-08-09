import { baseApi } from './baseApi'
import {
  GoogleConnectResponse,
  GoogleAccountsResponse
} from '@/types/google-workspace'

export const googleWorkspaceApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    connectGoogle: builder.query<GoogleConnectResponse, void>({
      query: () => ({ url: '/google/connect' }),
    }),
    getGoogleAccounts: builder.query<GoogleAccountsResponse, void>({
      query: () => ({ url: '/google/accounts' }),
      providesTags: ['GoogleWorkspace'],
    }),
    disconnectGoogleAccount: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/google/accounts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
  }),
})

export const {
  useLazyConnectGoogleQuery,
  useGetGoogleAccountsQuery,
  useDisconnectGoogleAccountMutation,
} = googleWorkspaceApi
