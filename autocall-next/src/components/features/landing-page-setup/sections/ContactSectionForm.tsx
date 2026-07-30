"use client"

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactSectionFormProps } from "@/types/landing"
import React from "react"

export const ContactSectionForm: React.FC<ContactSectionFormProps> = ({ t }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("contact_info_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput
          name="contact.section_badge"
          label={t("section_badge")}
          placeholder="We're Online"
        />
        <TextInput
          name="contact.heading"
          label={t("heading_title")}
          placeholder="Let's build something incredible together"
        />
        <TextAreaField
          name="contact.subheading"
          label={t("subheading_title")}
          placeholder="Have specific volume requirements..."
          rows={3}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            name="contact.email"
            label={t("support_email_address")}
            placeholder="support@autocall.ai"
          />
          <TextInput
            name="contact.phone"
            label={t("phone_number")}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            name="contact.address"
            label={t("physical_location_address")}
            placeholder="123 AI Street, Tech City, TC 12345"
          />
          <TextInput
            name="contact.live_chat_label"
            label={t("live_chat_badge_hint")}
            placeholder="Available 24/7"
          />
        </div>
      </CardContent>
    </div>
  )
}
