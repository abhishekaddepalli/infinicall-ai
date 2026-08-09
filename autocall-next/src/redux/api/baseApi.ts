
import { authUtils } from "@/utils/auth";
import { isBrowser } from "@/utils/environment";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../slices/authSlice";

const API_BASE_URL = "/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const token = authUtils.getToken();

    const publicEndpoints = ["getActivePlans", "getFaqs", "getPublicSettings", "getActiveTestimonials", "getBlogs", "getLandingPage", "getPageBySlug", "getPublicWidgetByKey", "getWidgetTokenByKey"];
    if (publicEndpoints.includes(endpoint)) {
      return headers;
    }

    if (token && token !== "undefined" && token !== "null") {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const token = authUtils.getToken();

  if (result.error && result.error.status === 401) {
    if (token) {
      authUtils.clearAuth();
      api.dispatch(clearAuth());
      api.dispatch(baseApi.util.resetApiState());
    }

    if (isBrowser) {
      const publicPaths = [
        "/login",
        "/team-member/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/",
        "/social-media",
        "/campaign-hub",
        "/page",
      ];
      const pathname = window.location.pathname;
      const isPublicPath = publicPaths.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );

      if (!isPublicPath) {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Faq', 'Role', 'Permission', 'Testimonial', 'ContactInquiry', 'Page', 'Language', 'AdminSettings', 'Blog', 'Tag', 'Category', 'Attachment', 'UserSettings', 'TemplateCategory', 'PromptTemplate', 'Voice', 'KnowledgeBase', 'Flow', 'Agent', 'Plan', 'Subscription', 'PaymentGateway', 'PhoneNumber', 'SipTrunk', 'ContactHub', 'ContactGroup', 'AIModel', 'Campaign', 'CampaignType', 'Appointments', 'Form', 'Dashboard', 'WhatsApp', 'Widget', 'WhatsAppTemplate', 'WhatsappConnections', 'LandingPage', 'ApiKey', 'TenantGuide', 'Notification', 'GoogleWorkspace', 'SmsTemplate', 'SmsCampaign', 'Team', 'TeamMember', 'SMSAgent', 'CallLogs', 'SystemEmailTemplate', 'NumberPurchaseRequest', 'RestrictedWords', 'RestrictedUsers', 'EmailLibrary', 'SmsInbox', 'EventWebhook'],
  endpoints: () => ({}),
});
