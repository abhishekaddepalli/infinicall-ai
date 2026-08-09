import { baseApi } from './baseApi'
import { Plan, PlanResponse } from '@/types/plans';


export const planApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPlans: builder.query<PlanResponse, any>({
      query: (params) => ({
        url: '/plan',
        params,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          const transformed = response.map((p: any) => ({
            ...p,
            price: p.amount ?? p.price,
            is_active: p.status === 'active' || p.is_active,
          }))
          return {
            success: true,
            data: transformed,
            pagination: {
              total: transformed.length,
              page: 1,
              limit: transformed.length,
              totalPages: 1,
            },
          }
        }
        return response
      },
      providesTags: ['Plan'],
    }),
    getActivePlans: builder.query<{ success: boolean; data: Plan[] }, void>({
      query: () => ({
        url: '/plan',
        params: { status: 'active' },
      }),
      transformResponse: (response: any) => {
        const data = Array.isArray(response) ? response : []
        const transformed = data.map((p: any) => ({
          ...p,
          price: p.amount ?? p.price,
          is_active: p.status === 'active' || p.is_active,
        }))
        return {
          success: true,
          data: transformed,
        }
      },
      providesTags: ['Plan'],
    }),
    getPlan: builder.query<{ success: boolean; data: Plan }, string>({
      query: (id) => `/plan/${id}`,
      transformResponse: (response: any) => {
        if (response && !response.data) {
          return {
            success: true,
            data: {
              ...response,
              price: response.amount ?? response.price,
              is_active: response.status === 'active' || response.is_active,
            },
          }
        }
        return response
      },
      providesTags: (result, error, id) => [{ type: 'Plan', id }],
    }),
    createPlan: builder.mutation<any, Partial<Plan>>({
      query: (data) => ({
        url: '/plan',
        method: 'POST',
        body: {
          ...data,
          amount: data.amount ?? data.price,
          status: data.is_active ? 'active' : 'inactive',
        },
      }),
      invalidatesTags: ['Plan'],
    }),
    updatePlan: builder.mutation<any, { id: string; data: Partial<Plan> }>({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: 'PUT',
        body: {
          ...data,
          amount: data.amount ?? data.price,
          status: data.is_active ? 'active' : 'inactive',
        },
      }),
      invalidatesTags: (result, error, { id }) => ['Plan', { type: 'Plan', id }],
    }),
    updatePlanStatus: builder.mutation<any, string>({
      query: (id) => ({
        url: `/plan/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => ['Plan', { type: 'Plan', id }],
    }),
    deletePlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/plan/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => ['Plan', { type: 'Plan', id }],
    }),
    deletePlans: builder.mutation<any, { plan_ids: string[] }>({
      query: (data) => ({
        url: '/plan',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Plan'],
    }),
    syncPlansToGateways: builder.mutation<any, { id?: string; force?: boolean } | void>({
      query: (data) => ({
        url: '/plan/sync-to-gateways',
        method: 'POST',
        body: data || { force: false },
      }),
      invalidatesTags: ['Plan'],
    }),
  }),
})

export const {
  useGetPlansQuery,
  useGetActivePlansQuery,
  useGetPlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useDeletePlansMutation,
  useUpdatePlanStatusMutation,
  useSyncPlansToGatewaysMutation,
} = planApi
