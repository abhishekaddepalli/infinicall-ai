'use client'

import MultiSelectField from "@/components/shared/MultiSelectField"
import TextInput from "@/components/shared/TextInput"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SmsScheduleSectionProps } from "@/types/sms-campaign"
import { useFormikContext } from "formik"
import { Calendar } from "lucide-react"
import { useTranslation } from "react-i18next"

export const SmsScheduleSection = ({ daysOfWeekOptions }: SmsScheduleSectionProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()

  const isEnabled = values.SMSSchedule?.enabled || false

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-title flex items-center gap-2.5 dark:text-white mb-0">
          <Calendar className="w-5 h-5 text-primary" />
          <span>{t("sms_schedule")}</span>
        </h2>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setFieldValue("SMSSchedule.enabled", checked)}
          className="data-[state=checked]:bg-primary shadow-sm"
        />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-white/5 sm:p-6 p-4 rounded-lg border border-input-border-color mt-4 transition-all duration-300 ${!isEnabled ? "opacity-50 pointer-events-none select-none" : ""}`}>
        <div className="flex flex-col space-y-2">
          <Label className="text-md font-semibold text-title">
            {t("start_time")}
          </Label>
          <Input
            type="time"
            value={values.SMSSchedule.callStartTime}
            onChange={(e) => setFieldValue("SMSSchedule.callStartTime", e.target.value)}
            className="h-10 rounded-radius bg-input-color border-input-border-color dark:border-white/10 font-bold focus:bg-input-color transition-all text-sm"
            disabled={!isEnabled}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="text-md font-semibold text-title">
            {t("end_time")}
          </Label>
          <Input
            type="time"
            value={values.SMSSchedule.callEndTime}
            onChange={(e) => setFieldValue("SMSSchedule.callEndTime", e.target.value)}
            className="h-10 rounded-radius bg-input-color border-input-border-color dark:border-white/10 font-bold focus:bg-input-color transition-all text-sm"
            disabled={!isEnabled}
          />
        </div>

        <TextInput
          name="SMSSchedule.timeZone"
          label={t("timezone")}
          placeholder="Asia/Kolkata"
          className="h-14 rounded-lg bg-input-color border-input-border-color dark:border-white/10 font-bold focus:bg-input-color transition-all text-sm"
          disabled={!isEnabled}
        />

        <div className="md:col-span-2 pt-2">
          <MultiSelectField
            label={t("days_of_week")}
            options={daysOfWeekOptions}
            value={values.SMSSchedule.dayOfWeek}
            onChange={(val) => setFieldValue("SMSSchedule.dayOfWeek", val)}
            placeholder={t("select_days")}
            disabled={!isEnabled}
          />
        </div>
      </div>
    </div>
  )
}
