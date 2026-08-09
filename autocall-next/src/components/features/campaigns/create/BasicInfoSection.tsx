'use client'

import SelectField from "@/components/shared/SelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { BasicInfoSectionProps } from "@/types/campaign"
import { Megaphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export const BasicInfoSection = ({
  campaignTypesOptions,
  agentsOptions,
  phoneNumbersOptions,
}: BasicInfoSectionProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-title flex items-center gap-2 mb-0 pb-4 dark:text-white">
        <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
          <Megaphone className="w-5 h-5 text-primary" />
        </div>
        <span>{t("basic_information")}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <TextInput
          name="name"
          label={t("campaign_name")}
          placeholder={t("enter_campaign_name")}
          className="h-10 rounded-radius bg-input-color border border-input-border-color font-medium focus:bg-input-color transition-all text-sm"
        />
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <SelectField
              name="typeId"
              label={t("campaign_type")}
              options={campaignTypesOptions}
              placeholder={t("select_campaign_type")}
              className="h-10 rounded-radius border border-input-border-color bg-input-color font-medium placeholder:text-muted-foreground  focus:bg-input-color transition-all text-sm"
              emptyStateTitle={t('no_types_found', { defaultValue: 'No Types Found' })}
              emptyStateDescription={t('no_types_desc', { defaultValue: 'Please add a campaign type before creating this record.' })}
              emptyStateActionLabel={t('add_type')}
              onEmptyStateAction={() => router.push(ROUTES.ATTRIBUTE_CAMPAIGN_TYPE)}
            />
          </div>
          <Button
            type="button"
            onClick={() => router.push(ROUTES.ATTRIBUTE_CAMPAIGN_TYPE)}
            className="h-10 px-4 bg-primary text-white font-bold transition-all rounded-radius shrink-0 mt-5"
          >
            + {t("add_type")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <SelectField
          name="agentId"
          label={t("flow_agent")}
          options={agentsOptions}
          placeholder={t("select_agent")}
          className="h-10 rounded-radius border border-input-border-color! bg-input-color font-medium focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm shadow-inner"
          emptyStateTitle={t('no_agents_found', { defaultValue: 'No Agents Found' })}
          emptyStateDescription={t('no_agents_desc', { defaultValue: 'Please add an agent before creating this record.' })}
          emptyStateActionLabel={t('add_agent', { defaultValue: 'Add Agent' })}
          onEmptyStateAction={() => router.push(ROUTES.AI_ASSISTANTS)}
        />
        <SelectField
          name="phoneNumberId"
          label={t("phone_number")}
          options={phoneNumbersOptions}
          placeholder={t("select_phone_number")}
          className="h-10 rounded-radius border border-input-border-color bg-input-color font-medium focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm shadow-inner"
          emptyStateTitle={t('no_phone_numbers_found', { defaultValue: 'No Phone Numbers Found' })}
          emptyStateDescription={t('no_phone_numbers_desc', { defaultValue: 'Please add a phone number before creating this record.' })}
          emptyStateActionLabel={t('add_phone_number', { defaultValue: 'Add Phone Number' })}
          onEmptyStateAction={() => router.push(ROUTES.PHONE_NUMBERS)}
        />
      </div>

      <TextAreaField
        name="description"
        label={t("description")}
        placeholder={t("enter_description")}
        className="min-h-[120px] rounded-2xl bg-input-color border-input-border-color font-medium focus:bg-input-color transition-all text-sm resize-none"
      />
    </div>
  )
}
