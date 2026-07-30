import { baseApi } from "./baseApi";

export const systemEmailTemplateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemEmailTemplates: builder.query<any, void>({
      query: () => "/system-email-templates",
      providesTags: ["SystemEmailTemplate"],
    }),
    updateSystemEmailTemplate: builder.mutation<any, { slug: string; data: any }>({
      query: ({ slug, data }) => ({
        url: `/system-email-templates/${slug}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SystemEmailTemplate"],
    }),
  }),
});

export const {
  useGetSystemEmailTemplatesQuery,
  useUpdateSystemEmailTemplateMutation,
} = systemEmailTemplateApi;
