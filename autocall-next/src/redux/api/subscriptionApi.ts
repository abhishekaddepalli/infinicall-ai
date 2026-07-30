import { Payment, Subscription } from '@/types/plans';
import { baseApi } from './baseApi'

export const subscriptionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserSubscription: builder.query<{ success: boolean; data: Subscription }, void>({
      query: () => '/subscription/my-subscription',
      providesTags: ['Subscription'],
    }),
    getMyPaymentHistory: builder.query<{ success: boolean; data: Payment[]; pagination: any }, any>({
      query: (params) => ({
        url: '/subscription/my-subscription/payments',
        params,
      }),
      providesTags: ['Subscription'],
    }),
    getAllSubscriptions: builder.query<{ success: boolean; data: { subscriptions: Subscription[]; pagination: any } }, any>({
      query: (params) => ({
        url: '/subscription',
        params,
      }),
      providesTags: ['Subscription'],
    }),
    getSubscriptionStats: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/subscription/stats',
      providesTags: ['Subscription'],
    }),
    getAllPayments: builder.query<{ success: boolean; data: Payment[]; stats: any; pagination: any }, any>({
      query: (params) => ({
        url: '/subscription/payments',
        params,
      }),
      providesTags: ['Subscription'],
    }),
    getPendingManualSubscriptions: builder.query<{ success: boolean; data: { subscriptions: Subscription[]; pagination: any } }, any>({
      query: (params) => ({
        url: '/subscription/pending-manual',
        params,
      }),
      providesTags: ['Subscription'],
    }),
    approveManualSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/${id}/approve-manual`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    rejectManualSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/${id}/reject-manual`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    assignPlanToUser: builder.mutation<any, { user_id: string; plan_id: string; duration?: number; amount?: number }>({
      query: (data) => ({
        url: '/subscription/assign',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    deleteSubscriptions: builder.mutation<any, { ids: string[] }>({
      query: (data) => ({
        url: '/subscription',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    cancelSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    resumeSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/${id}/resume`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    changeSubscriptionPlan: builder.mutation<any, { subscription_id: string; new_plan_id: string }>({
      query: ({ subscription_id, new_plan_id }) => ({
        url: `/subscription/${subscription_id}/change-plan`,
        method: 'POST',
        body: { new_plan_id },
      }),
      invalidatesTags: ['Subscription'],
    }),
    startTrial: builder.mutation<any, { plan_id: string }>({
      query: (data) => ({
        url: '/subscription/trial',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    initSubscription: builder.mutation<any, { plan_id: string; payment_gateway: 'stripe' | 'razorpay' | 'paypal'; embedded?: boolean }>({
      query: (data) => {
        const { payment_gateway, ...body } = data;
        return {
          url: `/subscription/create-${payment_gateway}`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Subscription', 'User'],
    }),
    confirmSubscription: builder.mutation<any, any>({
      query: (data) => ({
        url: '/subscription/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription', 'User'],
    }),
  }),
})

export const {
  useGetUserSubscriptionQuery,
  useGetMyPaymentHistoryQuery,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionStatsQuery,
  useGetAllPaymentsQuery,
  useGetPendingManualSubscriptionsQuery,
  useApproveManualSubscriptionMutation,
  useRejectManualSubscriptionMutation,
  useAssignPlanToUserMutation,
  useDeleteSubscriptionsMutation,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useChangeSubscriptionPlanMutation,
  useStartTrialMutation,
  useInitSubscriptionMutation,
  useConfirmSubscriptionMutation,
} = subscriptionApi
