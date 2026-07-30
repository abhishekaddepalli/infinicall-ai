'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGetContactGroupsQuery } from "@/redux/api/contactGroupApi"
import { ContactsSelectionSectionProps } from "@/types/campaign"
import { useFormikContext } from "formik"
import { Search, Users } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export const ContactsSelectionSection = ({ contactsOptions, renderType = 'both' }: ContactsSelectionSectionProps & { renderType?: 'groups' | 'individuals' | 'both' }) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()
  const { data: contactGroupsRes } = useGetContactGroupsQuery({ page: 1, limit: 100 })

  const [searchContacts, setSearchContacts] = useState("")
  const [searchGroups, setSearchGroups] = useState("")

  const contactGroupOptions = (contactGroupsRes?.data || []).map((group: any) => ({
    label: `${group.group_name} (${Array.isArray(group.group_contacts) ? group.group_contacts.length : 0})`,
    value: group.id || group._id || "",
  }))

  const filteredContacts = contactsOptions.filter(c => c.label.toLowerCase().includes(searchContacts.toLowerCase()))
  const filteredGroups = contactGroupOptions.filter(g => g.label.toLowerCase().includes(searchGroups.toLowerCase()))

  return (
    <>
      {/* Contact Groups Card */}
      {(renderType === 'both' || renderType === 'groups') && (
        <div className="flex flex-col h-full bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color min-h-[420px]">
          <h2 className="text-xl font-bold text-title flex items-center gap-2.5 pb-4 mb-4 dark:text-white border-b border-input-border-color">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span>{t("contact_groups")}</span>
          </h2>
          <div className="relative mb-4 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder={t("search")}
              className="pl-9 h-10 bg-input-color border-input-border-color rounded-lg"
              value={searchGroups}
              onChange={(e) => setSearchGroups(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-input-border-color shrink-0">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAllGroups"
                checked={values.contactGroupIds?.length === contactGroupOptions.length && contactGroupOptions.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFieldValue("contactGroupIds", contactGroupOptions.map((g: any) => g.value))
                  } else {
                    setFieldValue("contactGroupIds", [])
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="selectAllGroups" className="text-sm font-semibold text-title cursor-pointer">
                {t("select_all")}
              </Label>
            </div>
            <span className="text-sm text-primary font-medium">{values.contactGroupIds?.length || 0} {t("selected")}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-1 no-scrollbar max-h-[200px]">
            {filteredGroups.length === 0 ? (
              <p className="text-sm text-slate-500 text-center mt-4 italic">{t("no_groups_found")}</p>
            ) : (
              filteredGroups.map((group: any) => (
                <div key={group.value} className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id={`group-${group.value}`}
                    checked={(values.contactGroupIds || []).includes(group.value)}
                    onCheckedChange={(checked) => {
                      const current = values.contactGroupIds || [];
                      if (checked) setFieldValue("contactGroupIds", [...current, group.value]);
                      else setFieldValue("contactGroupIds", current.filter((id: string) => id !== group.value));
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`group-${group.value}`} className="text-md font-medium text-subtitle-color cursor-pointer truncate">
                    {group.label}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Individual Contacts Card */}
      {(renderType === 'both' || renderType === 'individuals') && (
        <div className="flex flex-col bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color">
          <h2 className="text-xl font-bold text-title flex items-center gap-2.5 pb-4 mb-4 dark:text-white border-b border-input-border-color">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span>{t("individual_contacts")}</span>
          </h2>
          <div className="relative mb-4 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder={t("search")}
              className="pl-9 h-10 bg-input-color border-input-border-color rounded-lg"
              value={searchContacts}
              onChange={(e) => setSearchContacts(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-input-border-color shrink-0">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAllContacts"
                checked={values.contactIds?.length === contactsOptions.length && contactsOptions.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFieldValue("contactIds", contactsOptions.map(c => c.value))
                  } else {
                    setFieldValue("contactIds", [])
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="selectAllContacts" className="text-sm font-semibold text-title cursor-pointer">
                {t("select_all")}
              </Label>
            </div>
            <span className="text-sm text-primary font-medium">{values.contactIds?.length || 0} {t("selected")}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-1 no-scrollbar max-h-[200px]">
            {filteredContacts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center mt-4 italic">{t("no_contacts_found")}</p>
            ) : (
              filteredContacts.map(contact => (
                <div key={contact.value} className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id={`contact-${contact.value}`}
                    checked={(values.contactIds || []).includes(contact.value)}
                    onCheckedChange={(checked) => {
                      const current = values.contactIds || [];
                      if (checked) setFieldValue("contactIds", [...current, contact.value]);
                      else setFieldValue("contactIds", current.filter((id: string) => id !== contact.value));
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`contact-${contact.value}`} className="text-md font-medium text-subtite-color cursor-pointer line-clamp-1 break-all whitespace-normal">
                    {contact.label}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
