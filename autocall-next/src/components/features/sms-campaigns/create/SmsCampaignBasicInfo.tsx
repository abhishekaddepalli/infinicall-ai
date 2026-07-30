'use client'

import SelectField from "@/components/shared/SelectField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { SmsCampaignBasicInfoProps } from "@/types/sms-campaign"
import { Megaphone, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export const SmsCampaignBasicInfo = ({
  campaignTypesOptions,
  phoneNumbersOptions,
  smsAgentsOptions,
}: SmsCampaignBasicInfoProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-title flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-white/5 dark:text-white">
        <Megaphone className="w-5 h-5 text-primary" />
        <span>{t("basic_information")}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TextInput
          name="name"
          label={t("campaign_name")}
          placeholder={t("enter_campaign_name")}
          className="h-10 rounded-lg bg-input-color border-input-border-color font-bold focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm shadow-inner"
        />

        <div className="flex items-end gap-4 w-full">
          <div className="flex-1">
            <SelectField
              name="typeId"
              label={t("campaign_type")}
              options={campaignTypesOptions}
              placeholder={t("select_campaign_type")}
              className="h-10 rounded-lg border border-input-border-color bg-input-color font-bold placeholder:text-muted-foreground  focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm shadow-inner"
              emptyStateTitle={t('no_types_found', { defaultValue: 'No Types Found' })}
              emptyStateDescription={t('no_types_desc', { defaultValue: 'Please add a campaign type before creating this record.' })}
              emptyStateActionLabel={t('add_type')}
              onEmptyStateAction={() => router.push(ROUTES.ATTRIBUTE_CAMPAIGN_TYPE)}
            />
          </div>
          <Button
            type="button"
            onClick={() => router.push(ROUTES.ATTRIBUTE_CAMPAIGN_TYPE)}
            className="h-10 p-padding! text-[12px] text-white font-extrabold capitalize transition-all rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" /> {t("add_type")}
          </Button>
        </div>

        <SelectField
          name="phoneNumberId"
          label={t("phone_number")}
          options={phoneNumbersOptions}
          placeholder={t("select_phone_number")}
          className="h-10 rounded-lg border border-input-border-color bg-input-color font-bold focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm shadow-inner"
          emptyStateTitle={t('no_phone_numbers_found', { defaultValue: 'No Phone Numbers Found' })}
          emptyStateDescription={t('no_phone_numbers_desc', { defaultValue: 'Please add a phone number before creating this record.' })}
          emptyStateActionLabel={t('add_phone_number', { defaultValue: 'Add Phone Number' })}
          onEmptyStateAction={() => router.push(ROUTES.PHONE_NUMBERS)}
        />

        <SelectField
          name="smsAgentId"
          label={t("sms_agent")}
          options={smsAgentsOptions}
          placeholder={t("select_sms_agent")}
          className="h-10 rounded-lg border border-input-border-color bg-input-color font-bold focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm shadow-inner"
          emptyStateTitle={t('no_sms_agents_found', { defaultValue: 'No SMS Agents Found' })}
          emptyStateDescription={t('no_sms_agents_desc', { defaultValue: 'Please add an SMS agent before creating this record.' })}
          emptyStateActionLabel={t('add_sms_agent', { defaultValue: 'Add SMS Agent' })}
          onEmptyStateAction={() => router.push(ROUTES.SMS_AGENTS)}
        />
      </div>
    </div>
  )
}
