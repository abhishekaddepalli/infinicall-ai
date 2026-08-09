'use client'

import { ContactsSelectionSection } from "@/components/features/campaigns/create/ContactsSelectionSection";
import { RecipientsSection } from "@/components/features/campaigns/create/RecipientsSection";
import { SmsCampaignBasicInfo } from "@/components/features/sms-campaigns/create/SmsCampaignBasicInfo";
import { SmsCampaignContentSection } from "@/components/features/sms-campaigns/create/SmsCampaignContentSection";
import { SmsScheduleSection } from "@/components/features/sms-campaigns/create/SmsScheduleSection";
import Spinner from '@/components/reusable/Spinner';
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useGetCampaignTypesQuery } from "@/redux/api/campaignApi";
import { useGetContactsQuery } from "@/redux/api/contactApi";
import { useGetPhoneNumbersQuery } from "@/redux/api/phoneNumberApi";
import { useGetSMSAgentsQuery } from "@/redux/api/smsAgentApi";
import { useGetSmsCampaignByIdQuery, useUpdateSmsCampaignMutation } from "@/redux/api/smsCampaignApi";
import { useGetSmsTemplatesQuery } from "@/redux/api/smsTemplateApi";
import { ApiError } from "@/types/api";
import { smsCampaignSchemas } from "@/utils/validation-schemas";
import { Form, Formik } from "formik";
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function EditSmsCampaignPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [updateSmsCampaign, { isLoading: isUpdating }] = useUpdateSmsCampaignMutation()

  const { data: campaignResponse, isLoading: isLoadingCampaign } = useGetSmsCampaignByIdQuery(id, { skip: !id })

  // Fetch dynamic select data
  const { data: campaignTypesRes } = useGetCampaignTypesQuery({ limit: 100 })
  const { data: phoneNumbersRes } = useGetPhoneNumbersQuery({ limit: 100 })
  const { data: contactsRes } = useGetContactsQuery({ limit: 500 })
  const { data: smsTemplatesRes } = useGetSmsTemplatesQuery({})
  const { data: smsAgentsRes } = useGetSMSAgentsQuery({ page: 1, limit: 100, search: "" })

  if (isLoadingCampaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const campaign = campaignResponse?.data || campaignResponse || {}

  const campaignTypesOptions = (campaignTypesRes?.campaignTypes || [])
    .filter((ct: any) => ct.status)
    .map((ct: any) => ({ label: ct.name, value: ct.id || ct._id || "" }))

  const phoneNumbersOptions = (phoneNumbersRes?.data || []).map((p: any) => ({
    label: p.phone_number,
    value: p.id || p._id || "",
  }))

  const contactsOptions = (contactsRes?.data || []).map((c: any) => ({
    label: `${c.first_name || ""} ${c.last_name || ""} (${c.phone_number || c.email || ""})`.trim(),
    value: c.id || c._id || "",
  }))

  const smsTemplatesList = Array.isArray(smsTemplatesRes) ? smsTemplatesRes : (smsTemplatesRes?.data || smsTemplatesRes?.smsTemplates || smsTemplatesRes?.templates || [])
  const smsTemplatesOptions = smsTemplatesList
    .filter((st: any) => st.status === true || st.status === 'true' || st.status === 1 || st.status === 'active' || st.status === 'Active')
    .map((st: any) => ({ label: st.name, value: st.id || st._id || "", content: st.content, description: st.description || "" }))

  const smsAgentsOptions = (smsAgentsRes?.data || [])
    .filter((agent: any) => agent.status === 'active')
    .map((agent: any) => ({ label: agent.name, value: agent._id || agent.id || "" }))

  const daysOfWeekOptions = [
    { label: t("monday"), value: "Monday" },
    { label: t("tuesday"), value: "Tuesday" },
    { label: t("wednesday"), value: "Wednesday" },
    { label: t("thursday"), value: "Thursday" },
    { label: t("friday"), value: "Friday" },
    { label: t("saturday"), value: "Saturday" },
    { label: t("sunday"), value: "Sunday" },
  ]

  const initialValues = {
    name: campaign.name || "",
    typeId: typeof campaign.typeId === 'object' ? (campaign.typeId?.id || campaign.typeId?._id) : (campaign.typeId || ""),
    phoneNumberId: typeof campaign.phoneNumberId === 'object' ? (campaign.phoneNumberId?.id || campaign.phoneNumberId?._id) : (campaign.phoneNumberId || ""),
    smsAgentId: typeof campaign.smsAgentId === 'object' ? (campaign.smsAgentId?.id || campaign.smsAgentId?._id) : (campaign.smsAgentId || ""),
    content: campaign.content || "",
    smsTemplateId: "",
    SMSSchedule: {
      enabled: !!campaign.SMSSchedule,
      callStartTime: campaign.SMSSchedule?.callStartTime || "09:00",
      callEndTime: campaign.SMSSchedule?.callEndTime || "18:00",
      timeZone: campaign.SMSSchedule?.timeZone || "Asia/Kolkata",
      dayOfWeek: campaign.SMSSchedule?.dayOfWeek || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    contactIds: campaign.contactIds?.map((c: any) => c._id || c.id || c) || [],
    contactGroupIds: campaign.contactGroupIds?.map((c: any) => c._id || c.id || c) || [],
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("typeId", values.typeId)
      formData.append("phoneNumberId", values.phoneNumberId)
      formData.append("smsAgentId", values.smsAgentId)
      formData.append("content", values.content)

      if (values.SMSSchedule.enabled) {
        formData.append("SMSSchedule", JSON.stringify({
          callStartTime: values.SMSSchedule.callStartTime,
          callEndTime: values.SMSSchedule.callEndTime,
          timeZone: values.SMSSchedule.timeZone,
          dayOfWeek: values.SMSSchedule.dayOfWeek
        }))
      }

      formData.append("contactIds", JSON.stringify(values.contactIds))

      if (selectedFile) {
        formData.append("contactFile", selectedFile)
      }

      await updateSmsCampaign({ id, data: formData }).unwrap()
      toast.success(t("campaign_updated_successfully"))
      router.push(ROUTES.SMS_CAMPAIGNS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-white space-y-8 w-full transition-colors duration-300">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.SMS_CAMPAIGNS)}
            className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <h1 className="text-3xl font-bold text-title line-clamp-1">
            <span>{t("edit_sms_campaign")}</span>
          </h1>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={smsCampaignSchemas.create(t)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, isSubmitting }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="lg:col-span-8 flex flex-col gap-8 h-full">
                {/* Basic Information Card */}
                <div className="bg-bg-card  sm:p-6 p-4 rounded-radius border border-input-border-color shrink-0">
                  <SmsCampaignBasicInfo
                    campaignTypesOptions={campaignTypesOptions}
                    phoneNumbersOptions={phoneNumbersOptions}
                    smsAgentsOptions={smsAgentsOptions}
                  />
                </div>

                {/* SMS Content Card */}
                <div className="bg-bg-card  sm:p-6 p-4 rounded-radius border border-input-border-color shrink-0">
                  <SmsCampaignContentSection smsTemplatesOptions={smsTemplatesOptions} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                  {/* Leads & Recipients Card */}
                  <div className="h-full flex flex-col bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color min-h-[420px]">
                    <RecipientsSection
                      selectedFile={selectedFile}
                      setSelectedFile={setSelectedFile}
                      existingFileName={campaign.contact_file ? campaign.contact_file.split('/').pop() : (campaign.contactFile ? campaign.contactFile.split('/').pop() : undefined)}
                    />
                  </div>

                  {/* Contact Groups Card */}
                  <ContactsSelectionSection contactsOptions={contactsOptions} renderType="groups" />
                </div>
              </div>

              {/* Right Column: Schedule & Individual Contacts (4 columns) */}
              <div className="lg:col-span-4 flex flex-col gap-8 h-full">
                {/* SMS Schedule Card */}
                <div className="bg-bg-card  sm:p-6 p-4 rounded-radius border border-input-border-color shrink-0">
                  <SmsScheduleSection daysOfWeekOptions={daysOfWeekOptions} />
                </div>

                {/* Individual Contacts Card */}
                <div className="flex-1 flex flex-col">
                  <ContactsSelectionSection contactsOptions={contactsOptions} renderType="individuals" />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-bg-card  sm:p-6 p-4 rounded-radius border border-input-border-color">
              <div className="flex gap-3 items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(ROUTES.SMS_CAMPAIGNS)}
                  disabled={isUpdating || isSubmitting}
                  className="rounded-radius! p-padding! h-12 border border-input-border-color bg font-extrabold tracking-widest text-[12px]"
                >
                  {t("cancel")}
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating || isSubmitting}
                  className="rounded-radius! p-padding! h-12 text-white font-extrabold tracking-widest text-[12px] transition-all hover:scale-[1.02]"
                >
                  {isUpdating || isSubmitting ? t("updating") : t("save_changes")}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
