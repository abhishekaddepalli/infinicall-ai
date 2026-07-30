'use client'

import { BasicInfoSection } from "@/components/features/campaigns/create/BasicInfoSection"
import { CallScheduleSection } from "@/components/features/campaigns/create/CallScheduleSection"
import { ContactsSelectionSection } from "@/components/features/campaigns/create/ContactsSelectionSection"
import { RecipientsSection } from "@/components/features/campaigns/create/RecipientsSection"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useGetAgentsQuery } from "@/redux/api/agentApi"
import { useCreateCampaignMutation, useGetCampaignTypesQuery } from "@/redux/api/campaignApi"
import { useGetContactsQuery } from "@/redux/api/contactApi"
import { useGetPhoneNumbersQuery } from "@/redux/api/phoneNumberApi"
import { useGetWhatsappPhoneNumbersQuery } from "@/redux/api/whatsappApi"
import { ApiError } from "@/types/api"
import { campaignSchemas } from "@/utils/validation-schemas"
import { Form, Formik } from "formik"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export default function CreateCampaignPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation()

  // Fetch dynamic select data
  const { data: campaignTypesRes } = useGetCampaignTypesQuery({ limit: 100 })
  const { data: agentsRes } = useGetAgentsQuery({ limit: 100 })
  const { data: phoneNumbersRes } = useGetPhoneNumbersQuery({ limit: 100 })
  const { data: whatsappPhoneNumbersRes } = useGetWhatsappPhoneNumbersQuery()
  const { data: contactsRes } = useGetContactsQuery({ limit: 500 })

  // Filter only flow type agents and fix the typescript any error
  const flowAgents = (agentsRes?.data || []).filter((agent: any) => agent.type === 'flow')

  const campaignTypesOptions = (campaignTypesRes?.campaignTypes || [])
    .filter((ct: any) => ct.status)
    .map((ct: any) => ({ label: ct.name, value: ct.id || ct._id || "" }))

  const agentsOptions = flowAgents.map((a: any) => ({ label: a.name, value: a.id || a._id || "" }))
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

  const initialValues = {
    name: "",
    typeId: "",
    description: "",
    agentId: "",
    phoneNumberId: "",
    callSchedule: {
      enabled: false,
      callStartTime: "09:00",
      callEndTime: "18:00",
      timeZone: "Asia/Kolkata",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    autoRetrySettings: {
      enabled: false,
      maxAttempts: 3,
      retryInterval: "1 hour",
      retryWhen: ["No Answer"],
    },
    contactIds: [],
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

      if (values.callSchedule.enabled) {
        formData.append("callSchedule", JSON.stringify({
          callStartTime: values.callSchedule.callStartTime,
          callEndTime: values.callSchedule.callEndTime,
          timeZone: values.callSchedule.timeZone,
          dayOfWeek: values.callSchedule.dayOfWeek
        }))
      }

      if (values.autoRetrySettings.enabled) {
        formData.append("autoRetrySettings", JSON.stringify({
          enabled: values.autoRetrySettings.enabled,
          maxAttempts: values.autoRetrySettings.maxAttempts,
          retryInterval: values.autoRetrySettings.retryInterval,
          retryWhen: values.autoRetrySettings.retryWhen
        }))
      }

      formData.append("contactIds", JSON.stringify(values.contactIds))

      if (selectedFile) {
        formData.append("contactFile", selectedFile)
      }

      await createCampaign(formData).unwrap()
      toast.success(t("campaign_created_successfully"))
      router.push(ROUTES.CAMPAIGNS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  return (
    <div className="min-h-screen  text-slate-900 dark:text-white space-y-8 w-full transition-colors duration-300">

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.CAMPAIGNS)}
            className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <h1 className="text-3xl font-bold text-title line-clamp-1">
            <span>{t("create_campaign")}</span>
          </h1>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={campaignSchemas.create(t)}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => (
          <Form className="space-y-8">
            {/* Top Grid for Info and Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Basic Information (7 columns) */}
              <div className="lg:col-span-7">
                <div className="bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color h-full">
                  <BasicInfoSection
                    campaignTypesOptions={campaignTypesOptions}
                    agentsOptions={agentsOptions}
                    phoneNumbersOptions={phoneNumbersOptions}
                  />
                </div>
              </div>

              {/* Right Column: Schedule & Auto Retry (5 columns) */}
              <div className="lg:col-span-5">
                <div className="bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color h-full">
                  <CallScheduleSection daysOfWeekOptions={daysOfWeekOptions} />
                </div>
              </div>
            </div>

            {/* Bottom Grid for Recipients and Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
              <div className="bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color h-full min-h-[420px]">
                <RecipientsSection
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
              </div>

              <ContactsSelectionSection contactsOptions={contactsOptions} />
            </div>

            {/* Bottom Actions Bar */}
            <div>
              <div className="flex gap-3 items-center justify-end">

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(ROUTES.CAMPAIGNS)}
                  disabled={isCreating || isSubmitting}
                  className="rounded-radius! p-padding! bg-subcard border border-input-border-color font-medium text-md"
                >
                  {t("cancel")}
                </Button>

                <Button
                  type="submit"
                  disabled={isCreating || isSubmitting}
                  className="rounded-radius! p-padding! text-white font-medium text-md transition-all"
                >
                  {isCreating || isSubmitting ? t("creating") : t("create")}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
