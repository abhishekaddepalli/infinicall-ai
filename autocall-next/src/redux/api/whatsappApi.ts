import { baseApi } from "./baseApi";

export const whatsappApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWhatsappPhoneNumbers: builder.query<any, void>({
      query: () => "/whatsapp/phone-numbers",
      providesTags: ["WhatsApp"],
    }),
    getManualConnectDetails: builder.query<any, void>({
      query: () => "/whatsapp/manual-connect-details",
      providesTags: ["WhatsApp"],
    }),
    disconnectWaba: builder.mutation<any, void>({
      query: () => ({
        url: "/whatsapp/disconnect",
        method: "POST",
      }),
      invalidatesTags: ["WhatsApp"],
    }),
    connection: builder.mutation<any, { code: string; data: any }>({
      query: (data) => ({
        url: "/whatsapp/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WhatsApp"],
    }),
    getConnections: builder.query<any, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/whatsapp/connections",
        params: params || undefined,
      }),
      providesTags: ["WhatsappConnections"],
    }),
    manualConnect: builder.mutation<any, { phone_number_id: string; waba_id: string; business_id: string; registered_phone_number: string; access_token: string }>({
      query: (data) => ({
        url: "/whatsapp/manual-connect",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WhatsApp", "WhatsappConnections"],
    }),
  }),
});

export const { useGetWhatsappPhoneNumbersQuery, useGetManualConnectDetailsQuery, useDisconnectWabaMutation, useConnectionMutation, useGetConnectionsQuery, useManualConnectMutation } = whatsappApi;
