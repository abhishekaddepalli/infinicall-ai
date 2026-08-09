import { UserQueryParams, UserResponse } from '@/types/api';
import { User } from '@/types/auth';
import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, UserQueryParams>({
      query: (params) => ({
        url: '/user/all',
        params,
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<{message:string; data: User}, FormData>({
      query: (body) => ({
        url: '/user/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<{ message: string; user: User }, FormData>({
      query: (body) => ({
        url: '/user/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserStatus: builder.mutation<{message?: string}, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/user/${id}/update/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUsers: builder.mutation<{message?: string}, string[]>({
      query: (ids) => ({
        url: '/user/delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['User'],
    }),
    addBonusCredits: builder.mutation<{message?: string; credits?: number}, { id: string; amount: number }>({
      query: (body) => ({
        url: '/user/add-bonus-credits',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUsersMutation,
  useAddBonusCreditsMutation,
} = userApi
