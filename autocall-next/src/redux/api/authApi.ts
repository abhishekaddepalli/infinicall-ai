import { ForgotPasswordRequest, GenericResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ResetPasswordRequest, VerifyOtpRequest } from '@/types/api';
import { baseApi } from './baseApi'


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    teamMemberLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/team-member/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    googleSignup: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/google/signup',
        method: 'GET',
      }),
    }),
    facebookSignup: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/facebook/signup',
        method: 'GET',
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<{ user: any }, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),
    getTeamMemberProfile: builder.query<{ success: boolean; user: any }, void>({
      query: () => '/auth/team-member/profile',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),
    updateProfile: builder.mutation<{ message: string; user: any }, FormData>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    requestPasswordReset: builder.mutation<GenericResponse & { demo_otp?: string | null }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/request-password-reset',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyRegistrationOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/auth/register-verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation<GenericResponse & { demo_otp?: string | null }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation<GenericResponse, any>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    getDemoCredentials: builder.query<{
      demo: boolean;
      admin?: { email: string; password: string };
      user?: { email: string; password: string };
    }, void>({
      query: () => '/demo',
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useGetTeamMemberProfileQuery,
  useUpdateProfileMutation,
  useRequestPasswordResetMutation,
  useVerifyOtpMutation,
  useVerifyRegistrationOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetDemoCredentialsQuery,
  useTeamMemberLoginMutation,
  useGoogleSignupMutation,
  useFacebookSignupMutation,
} = authApi
