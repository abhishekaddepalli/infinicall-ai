import {
  GetGatewayByNameResponse,
  GetGatewaysResponse,
  UpdateGatewayRequest,
  WebhookUrlsResponse
} from '@/types/payment-gateway'
import { baseApi } from './baseApi'

export const paymentGatewayApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGateways: builder.query<GetGatewaysResponse, void>({
      query: () => ({
        url: '/payment-gateway-config',
      }),
      providesTags: ['PaymentGateway'],
    }),

    getGatewayByName: builder.query<GetGatewayByNameResponse, string>({
      query: (name) => ({
        url: `/payment-gateway-config/${name}`,
      }),
      providesTags: (result, error, name) => [{ type: 'PaymentGateway' as const, id: name }],
    }),

    updateGateway: builder.mutation<any, { name: string; data: UpdateGatewayRequest }>({
      query: ({ name, data }) => ({
        url: `/payment-gateway-config/${name}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { name }) => ['PaymentGateway', { type: 'PaymentGateway', id: name }],
    }),

    toggleGatewayStatus: builder.mutation<any, string>({
      query: (name) => ({
        url: `/payment-gateway-config/${name}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, name) => ['PaymentGateway', { type: 'PaymentGateway', id: name }],
    }),

    testGateway: builder.mutation<any, string>({
      query: (name) => ({
        url: `/payment-gateway-config/${name}/test`,
        method: 'POST',
      }),
    }),

    getWebhookUrls: builder.query<WebhookUrlsResponse, void>({
      query: () => ({
        url: '/payment-gateway-config/webhook-urls',
      }),
    }),

    reregisterWebhook: builder.mutation<any, string>({
      query: (name) => ({
        url: `/payment-gateway-config/${name}/reregister-webhook`,
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetGatewaysQuery,
  useGetGatewayByNameQuery,
  useUpdateGatewayMutation,
  useToggleGatewayStatusMutation,
  useTestGatewayMutation,
  useGetWebhookUrlsQuery,
  useReregisterWebhookMutation,
} = paymentGatewayApi
