'use client'

import MultiSelectField from "@/components/shared/MultiSelectField"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CallScheduleSectionProps } from "@/types/campaign"
import { useFormikContext } from "formik"
import { Calendar } from "lucide-react"
import { useTranslation } from "react-i18next"

export const CallScheduleSection = ({ daysOfWeekOptions }: CallScheduleSectionProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()

  const isEnabled = values.callSchedule?.enabled || false

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-input-border-color flex items-center justify-between">
        <h2 className="text-xl font-bold text-title flex items-center gap-2.5 dark:text-white">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />

          </div>
          <span>{t("call_schedule")}</span>
        </h2>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setFieldValue("callSchedule.enabled", checked)}
          className="data-[state=checked]:bg-primary shadow-sm"
        />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-subcard sm:p-6 p-4 rounded-lg border border-input-border-color mt-4 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
        <div className="flex flex-col space-y-2">
          <Label className="text-md font-semibold text-title">
            {t("start_time")}
          </Label>
          <Input
            type="time"
            value={values.callSchedule.callStartTime}
            onChange={(e) => setFieldValue("callSchedule.callStartTime", e.target.value)}
            className="h-10 rounded-radius bg-input-color border-input-border-color dark:border-white/10 font-bold focus:bg-input-color transition-all text-sm shadow-inner"
            disabled={!isEnabled}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="text-md font-semibold text-title">
            {t("end_time")}
          </Label>
          <Input
            type="time"
            value={values.callSchedule.callEndTime}
            onChange={(e) => setFieldValue("callSchedule.callEndTime", e.target.value)}
            className="h-10 rounded-radius bg-input-color border-input-border-color dark:border-white/10 font-bold focus:bg-input-color transition-all text-sm shadow-inner"
            disabled={!isEnabled}
          />
        </div>

        <div className="md:col-span-2 flex flex-col space-y-2">
          <Label className="text-md font-semibold text-title">
            {t("timezone")}
          </Label>
          <Input
            value={values.callSchedule?.timeZone || ""}
            onChange={(e) => setFieldValue("callSchedule.timeZone", e.target.value)}
            placeholder="Asia/Kolkata"
            className="h-10 rounded-radius bg-input-color border-input-border-color dark:border-white/10 font-bold focus:bg-input-color transition-all text-sm shadow-inner"
            disabled={!isEnabled}
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <MultiSelectField
            label={t("days_of_week")}
            options={daysOfWeekOptions}
            value={values.callSchedule.dayOfWeek}
            onChange={(val) => setFieldValue("callSchedule.dayOfWeek", val)}
            placeholder={t("select_days")}
          />
        </div>
      </div>
    </div>
  )
}
