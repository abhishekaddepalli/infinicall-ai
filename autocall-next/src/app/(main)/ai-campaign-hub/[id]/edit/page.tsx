'use client'

import { BasicInfoSection } from "@/components/features/campaigns/create/BasicInfoSection"
import { CallScheduleSection } from "@/components/features/campaigns/create/CallScheduleSection"
import { ContactsSelectionSection } from "@/components/features/campaigns/create/ContactsSelectionSection"
import { RecipientsSection } from "@/components/features/campaigns/create/RecipientsSection"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useGetAgentsQuery } from "@/redux/api/agentApi"
import {
  useGetCampaignByIdQuery,
  useGetCampaignTypesQuery,
  useUpdateCampaignMutation
} from "@/redux/api/campaignApi"
import { useGetContactsQuery } from "@/redux/api/contactApi"
import { useGetPhoneNumbersQuery } from "@/redux/api/phoneNumberApi"
import { useGetWhatsappPhoneNumbersQuery } from "@/redux/api/whatsappApi"
import { ApiError } from "@/types/api"
import { campaignSchemas } from "@/utils/validation-schemas"
import { Form, Formik } from "formik"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export default function EditCampaignPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch campaign by ID
  const { data: campaignRes, isLoading: isLoadingCampaign, isError } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  })

  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation()

  // Fetch dynamic select data
  const { data: campaignTypesRes } = useGetCampaignTypesQuery({ limit: 100 })
  const { data: agentsRes } = useGetAgentsQuery({ limit: 100 })
  const { data: phoneNumbersRes } = useGetPhoneNumbersQuery({ limit: 100 })
  const { data: whatsappPhoneNumbersRes } = useGetWhatsappPhoneNumbersQuery()
  const { data: contactsRes } = useGetContactsQuery({ limit: 500 })

  // Include all created AI assistants and flow agents for campaign dispatch
  const campaignTypesOptions = (campaignTypesRes?.campaignTypes || [])
    .filter((ct: any) => ct.status)
    .map((ct: any) => ({ label: ct.name, value: ct.id || ct._id || "" }))

  const availableAgents = agentsRes?.data || []
  const agentsOptions = availableAgents.map((a: any) => ({ label: a.name, value: a.id || a._id || "" }))

  const stdPhoneNumbers = (phoneNumbersRes?.data || []).map((p: any) => ({
    label: p.phone_number,
    value: p.id || p._id || "",
  }))
  const waPhoneNumbers = (whatsappPhoneNumbersRes?.data || []).map((p: any) => ({
    label: `${p.display_phone_number} (WhatsApp)`,
    value: p.id || p._id || "",
  }))
  const phoneNumbersOptions = [...stdPhoneNumbers, ...waPhoneNumbers]

  const contactsOptions = (contactsRes?.data || []).map((c: any) => ({
    label: `${c.first_name || ""} ${c.last_name || ""} (${c.phone_number || c.email || ""})`.trim(),
    value: c.id || c._id || "",
  }))

  const daysOfWeekOptions = [
    { label: t("monday"), value: "Monday" },
    { label: t("tuesday"), value: "Tuesday" },
    { label: t("wednesday"), value: "Wednesday" },
    { label: t("thursday"), value: "Thursday" },
    { label: t("friday"), value: "Friday" },
    { label: t("saturday"), value: "Saturday" },
    { label: t("sunday"), value: "Sunday" },
  ]

  if (isLoadingCampaign) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center gap-4 bg-slate-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        <p className="text-sm font-bold text-zinc-400 animate-pulse uppercase tracking-wider">
          {t("loading_campaign_details")}
        </p>
      </div>
    )
  }

  if (isError || !campaignRes?.data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-slate-50/50 text-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-slate-500 font-bold">{t("campaign_not_found")}</p>
        <Button onClick={() => router.push(ROUTES.CAMPAIGNS)} className="rounded-xl px-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
      </div>
    )
  }

  const campaign = campaignRes.data

  // Safe mappings for populated relational fields
  const typeIdValue = typeof campaign.typeId === 'object' && campaign.typeId
    ? (campaign.typeId as any)._id || (campaign.typeId as any).id || ""
    : campaign.typeId || ""

  const agentIdValue = typeof campaign.agentId === 'object' && campaign.agentId
    ? (campaign.agentId as any)._id || (campaign.agentId as any).id || ""
    : campaign.agentId || ""

  const phoneNumberIdValue = typeof campaign.phoneNumberId === 'object' && campaign.phoneNumberId
    ? (campaign.phoneNumberId as any)._id || (campaign.phoneNumberId as any).id || ""
    : campaign.phoneNumberId || ""

  const contactIdsValue = Array.isArray(campaign.contactIds)
    ? campaign.contactIds.map((c: any) => typeof c === 'object' && c ? c._id || c.id || "" : c)
    : []

  const initialValues = {
    name: campaign.name || "",
    typeId: typeIdValue,
    description: campaign.description || "",
    agentId: agentIdValue,
    phoneNumberId: phoneNumberIdValue,
    callSchedule: {
      enabled: !!campaign.callSchedule,
      callStartTime: campaign.callSchedule?.callStartTime || "09:00",
      callEndTime: campaign.callSchedule?.callEndTime || "18:00",
      timeZone: campaign.callSchedule?.timeZone || "Asia/Kolkata",
      dayOfWeek: campaign.callSchedule?.dayOfWeek || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    autoRetrySettings: {
      enabled: campaign.autoRetrySettings?.enabled || false,
      maxAttempts: campaign.autoRetrySettings?.maxAttempts || 3,
      retryInterval: campaign.autoRetrySettings?.retryInterval || "1 hour",
      retryWhen: campaign.autoRetrySettings?.retryWhen || ["No Answer"],
    },
    contactIds: contactIdsValue,
    contactGroupIds: [],
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("typeId", values.typeId)
      formData.append("description", values.description)
      formData.append("agentId", values.agentId)
      formData.append("phoneNumberId", values.phoneNumberId)

      formData.append("callSchedule", JSON.stringify({
        callStartTime: values.callSchedule.callStartTime,
        callEndTime: values.callSchedule.callEndTime,
        timeZone: values.callSchedule.timeZone,
        dayOfWeek: values.callSchedule.dayOfWeek
      }))

      formData.append("autoRetrySettings", JSON.stringify({
        enabled: values.autoRetrySettings.enabled,
        maxAttempts: values.autoRetrySettings.maxAttempts,
        retryInterval: values.autoRetrySettings.retryInterval,
        retryWhen: values.autoRetrySettings.retryWhen
      }))

      formData.append("contactIds", JSON.stringify(values.contactIds))

      if (selectedFile) {
        formData.append("contactFile", selectedFile)
      }

      await updateCampaign({ id: campaignId, data: formData }).unwrap()
      toast.success(t("campaign_updated_successfully"))
      router.push(ROUTES.CAMPAIGNS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  return (
    <div className="min-h-screen  space-y-8 w-full transition-colors duration-300">

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push(ROUTES.CAMPAIGNS)}
              className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20 p-0!"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span>{t("edit_campaign")}</span>
          </h1>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={campaignSchemas.create(t)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, isSubmitting }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Left Column: Basic Information and Recipients */}
              <div className="lg:col-span-7 space-y-8">
                {/* Basic Information Card */}
                <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color">
                  <BasicInfoSection
                    campaignTypesOptions={campaignTypesOptions}
                    agentsOptions={agentsOptions}
                    phoneNumbersOptions={phoneNumbersOptions}
                  />
                </div>
              </div>

              {/* Right Column: Schedule & Auto Retry */}
              <div className="lg:col-span-5 space-y-8">
                {/* Call Schedule Card */}
                <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color">
                  <CallScheduleSection daysOfWeekOptions={daysOfWeekOptions} />
                </div>
              </div>
            </div>

            {/* Audience & Contact Selection Cards - Full Width Below */}
            <div className="grid lg660:grid-cols-1 md:grid-cols-3 lg991:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color flex flex-col h-full min-h-[420px]">
                <RecipientsSection
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  existingFileName={campaign.contactFile ? campaign.contactFile.split('/').pop() : undefined}
                />
              </div>
              <ContactsSelectionSection contactsOptions={contactsOptions} />
            </div>

            {/* Bottom Actions Bar */}
            <div className=" flex items-center justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(ROUTES.CAMPAIGNS)}
                disabled={isUpdating || isSubmitting}
                className="h-12 p-padding! rounded-lg text-subtitle-color bg-subcard font-extrabold text-xs border border-input-border-color"
              >
                {t("cancel")}
              </Button>

              <Button
                type="submit"
                disabled={isUpdating || isSubmitting}
                className="h-12 p-padding! rounded-lg bg-primary text-white font-extrabold text-xs transition-all"
              >
                {isUpdating || isSubmitting ? t("saving") : t("save_changes")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
