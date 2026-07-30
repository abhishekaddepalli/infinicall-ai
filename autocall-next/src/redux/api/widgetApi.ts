import { 
  Widget, 
  WidgetDetailResponse, 
  WidgetListResponse, 
  WidgetMutationResponse,
  WidgetEmbedResponse,
  WidgetTokenResponse,
  WidgetAnalyticsResponse,
} from '@/types/widget'
import { baseApi } from './baseApi'

export const widgetApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getWidgets: builder.query<WidgetListResponse, { page?: number; limit?: number; search?: string; status?: string; sortBy?: string; sortOrder?: string } | void>({
      query: (params) => ({ url: '/widgets', params: params || {} }),
      providesTags: ['Widget'],
    }),
    getWidgetAnalytics: builder.query<WidgetAnalyticsResponse, void>({
      query: () => ({ url: '/widgets/analytics' }),
      providesTags: ['Widget'],
    }),
    getWidgetById: builder.query<WidgetDetailResponse, string>({
      query: (id) => ({ url: `/widgets/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'Widget', id }],
    }),
    createWidget: builder.mutation<WidgetMutationResponse, Partial<Widget>>({
      query: (body) => ({ url: '/widgets', method: 'POST', body }),
      invalidatesTags: ['Widget'],
    }),
    updateWidget: builder.mutation<WidgetMutationResponse, { id: string } & Partial<Widget>>({
      query: ({ id, ...body }) => ({ url: `/widgets/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => ['Widget', { type: 'Widget', id }],
    }),
    deleteWidget: builder.mutation<any, { widgetIds: string[] }>({
      query: (body) => ({ url: '/widgets/delete', method: 'DELETE', body }),
      invalidatesTags: ['Widget'],
    }),
    getEmbedCode: builder.query<WidgetEmbedResponse, string>({
      query: (id) => ({ url: `/widgets/${id}/embed` }),
    }),
    getPublicWidgetByKey: builder.query<WidgetDetailResponse, string>({
      query: (key) => ({ url: `/widgets/public/${key}` }),
    }),
    getWidgetTokenByKey: builder.query<WidgetTokenResponse, string>({
      query: (key) => ({ url: `/widgets/token/${key}`, params: { t: Date.now() } }),
    }),
  }),
})

export const {
  useGetWidgetsQuery,
  useGetWidgetByIdQuery,
  useCreateWidgetMutation,
  useUpdateWidgetMutation,
  useDeleteWidgetMutation,
  useGetEmbedCodeQuery,
  useLazyGetEmbedCodeQuery,
  useGetPublicWidgetByKeyQuery,
  useLazyGetWidgetTokenByKeyQuery,
  useGetWidgetAnalyticsQuery,
} = widgetApi
