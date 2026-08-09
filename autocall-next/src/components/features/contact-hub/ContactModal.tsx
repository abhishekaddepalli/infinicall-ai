'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ContactModalProps } from '@/types/contact'
import { Mail, Phone, Settings2, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ContactModal({ isOpen, onClose, onConfirm, initialData, isLoading }: ContactModalProps) {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFirstName(initialData.first_name || '')
        setLastName(initialData.last_name || '')
        setPhone(initialData.phone_number || '')
        setEmail(initialData.email || '')
      } else {
        setFirstName('')
        setLastName('')
        setPhone('')
        setEmail('')
      }
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    onConfirm({
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      email
    })
  }

  const isFormValid = phone.trim().length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0 rounded-modal-radius gap-0 border-input-border-color shadow-2xl bg-white overflow-auto no-scrollbar max-h-[90vh] flex flex-col">
        <DialogHeader className="sm:p-6 p-4 pb-6 shrink-0 mb-0 bg-linear-to-b  from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-title flex items-center gap-4">{initialData ? t("edit_contact") : t("create_contact")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 sm:p-6 p-4 pt-0! space-y-6 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label className="text-md font-medium text-title">{t("first_name")}</Label>
              <div className="relative group">
                <Input placeholder={t("first_name_placeholder")} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 pl-10 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all" />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color transition-colors" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-md font-medium text-title">{t("last_name")}</Label>
              <div className="relative group">
                <Input placeholder={t("last_name_placeholder")} value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 pl-10 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all" />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-md font-medium text-title">{t("phone_number")}</Label>
            <div className="relative group">
              <Input placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\+0-9]/g, ''))} className="h-10 pl-10 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all" />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color transition-colors" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-md font-medium text-title">{t("email_address")}</Label>
            <div className="relative group">
              <Input placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 pl-12 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all" />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color transition-colors" />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 sm:p-6 p-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading || !isFormValid} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
            {isLoading ? <Settings2 className="w-5 h-5 animate-spin" /> : initialData ? t("save_changes") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
