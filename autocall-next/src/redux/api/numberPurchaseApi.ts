import {
  InitiatePurchaseResponse,
  NumberPurchaseRequestsResponse
} from '@/types/number-purchase';
import { PhoneNumberListResponse } from '@/types/phone-number';
import { baseApi } from './baseApi';

export const numberPurchaseApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAvailableNumbers: builder.query<PhoneNumberListResponse, void>({
      query: () => ({
        url: '/number-purchase/available',
      }),
      providesTags: ['PhoneNumber'],
    }),
    getAllPurchaseRequests: builder.query<NumberPurchaseRequestsResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/number-purchase/admin',
        params,
      }),
      providesTags: ['NumberPurchaseRequest'],
    }),
    initiatePurchase: builder.mutation<InitiatePurchaseResponse, { phone_number_id: string; payment_gateway: string }>({
      query: (data) => ({
        url: '/number-purchase/initiate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PhoneNumber', 'NumberPurchaseRequest'],
    }),
    markPaymentSuccess: builder.mutation<any, { id: string; session_id?: string; payment_gateway?: string; razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string; paypal_order_id?: string; }>({
      query: ({ id, ...data }) => ({
        url: `/number-purchase/payment-success/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['NumberPurchaseRequest'],
    }),
    uploadKycDocuments: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/number-purchase/upload-kyc/${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['NumberPurchaseRequest'],
    }),
    verifyPurchaseRequest: builder.mutation<any, { id: string; status: 'approved' | 'rejected'; reason?: string }>({
      query: ({ id, status, reason }) => ({
        url: `/number-purchase/admin/${id}/verify`,
        method: 'POST',
        body: { kyc_status: status, admin_notes: reason },
      }),
      invalidatesTags: ['NumberPurchaseRequest', 'PhoneNumber'],
    }),
  }),
})

export const {
  useGetAvailableNumbersQuery,
  useGetAllPurchaseRequestsQuery,
  useInitiatePurchaseMutation,
  useMarkPaymentSuccessMutation,
  useUploadKycDocumentsMutation,
  useVerifyPurchaseRequestMutation,
} = numberPurchaseApi
