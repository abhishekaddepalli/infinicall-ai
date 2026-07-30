import { EventWebhook, WebhooksResponse } from '@/types/event-webhook';
import { baseApi } from './baseApi';

export const eventWebhooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWebhooks: builder.query<WebhooksResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/event-webhooks',
        method: 'GET',
        params,
      }),
      providesTags: ['EventWebhook'],
    }),
    createWebhook: builder.mutation<{ message: string; data: EventWebhook }, Partial<EventWebhook>>({
      query: (body) => ({
        url: '/event-webhooks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EventWebhook'],
    }),
    updateWebhook: builder.mutation<{ message: string; data: EventWebhook }, { id: string; body: Partial<EventWebhook> }>({
      query: ({ id, body }) => ({
        url: `/event-webhooks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['EventWebhook'],
    }),
    deleteWebhook: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/event-webhooks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EventWebhook'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWebhooksQuery,
  useCreateWebhookMutation,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
} = eventWebhooksApi;
