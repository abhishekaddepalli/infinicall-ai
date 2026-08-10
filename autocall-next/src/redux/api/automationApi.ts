import { baseApi } from './baseApi';

export const automationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    testN8nWebhook: builder.mutation<{
      success: boolean;
      message: string;
      status_code: number;
      response_time_ms: number;
      response_data: any;
    }, { webhook_url: string; event_type?: string; sample_payload?: any }>({
      query: (data) => ({
        url: '/automation/n8n/test-trigger',
        method: 'POST',
        body: data,
      }),
    }),
    generateAiScript: builder.mutation<{
      success: boolean;
      data: {
        business_name: string;
        system_prompt: string;
        initial_greeting: string;
        objection_handling: { objection: string; response: string }[];
        recommended_variables: string[];
      };
    }, {
      business_name: string;
      business_domain?: string;
      target_audience?: string;
      call_goal: string;
      tone?: string;
    }>({
      query: (data) => ({
        url: '/automation/ai-generate-script',
        method: 'POST',
        body: data,
      }),
    }),
    sendPostCallUpi: builder.mutation<{
      success: boolean;
      message: string;
      data: {
        link_id: string;
        amount: number;
        currency: string;
        customer_phone: string;
        upi_payment_url: string;
        qr_code_url: string;
        sms_preview: string;
        status: string;
      };
    }, {
      customer_name?: string;
      customer_phone: string;
      plan_name?: string;
      amount: number;
      currency?: string;
    }>({
      query: (data) => ({
        url: '/automation/send-post-call-upi',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useTestN8nWebhookMutation,
  useGenerateAiScriptMutation,
  useSendPostCallUpiMutation,
} = automationApi;
