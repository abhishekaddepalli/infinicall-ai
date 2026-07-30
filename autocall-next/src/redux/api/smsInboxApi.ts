import { baseApi } from "./baseApi";
import {
  SmsSession,
  SmsMessage,
  GetSmsSessionsParams,
  AssignSessionPayload,
  ReplySessionPayload,
} from "../../types/shared";

export const smsInboxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSmsSessions: builder.query<{ sessions: SmsSession[] }, GetSmsSessionsParams | void>({
      query: (params) => ({
        url: "/sms-inbox/sessions",
        params: params || {},
      }),
      providesTags: ["SmsInbox"],
    }),
    getSmsMessages: builder.query<{ messages: SmsMessage[] }, string>({
      query: (sessionId) => `/sms-inbox/sessions/${sessionId}/messages`,
      providesTags: (result, error, id) => [{ type: "SmsInbox", id }],
    }),
    assignSmsSession: builder.mutation<void, AssignSessionPayload>({
      query: ({ sessionId, member_id }) => ({
        url: `/sms-inbox/sessions/${sessionId}/assign`,
        method: "POST",
        body: { member_id },
      }),
      invalidatesTags: ["SmsInbox"],
    }),
    replySmsSession: builder.mutation<void, ReplySessionPayload>({
      query: ({ sessionId, message }) => ({
        url: `/sms-inbox/sessions/${sessionId}/reply`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        "SmsInbox",
        { type: "SmsInbox", id: sessionId },
      ],
    }),
    resolveSmsSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/sms-inbox/sessions/${sessionId}/resolve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, sessionId) => [
        "SmsInbox",
        { type: "SmsInbox", id: sessionId },
      ],
    }),
    getReplyTeamMembers: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/sms-inbox/team-members",
      providesTags: ["SmsInbox"],
    }),
  }),
});

export const {
  useGetSmsSessionsQuery,
  useGetSmsMessagesQuery,
  useAssignSmsSessionMutation,
  useReplySmsSessionMutation,
  useResolveSmsSessionMutation,
  useGetReplyTeamMembersQuery,
} = smsInboxApi;
